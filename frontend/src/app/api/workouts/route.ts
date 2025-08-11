import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Workout data validation schemas
const WorkoutSetSchema = z.object({
  reps: z.number().min(0),
  weight: z.number().min(0),
  restTime: z.number().optional(),
  completed: z.boolean()
});

const WorkoutExerciseSchema = z.object({
  exerciseId: z.string(),
  exerciseName: z.string(),
  category: z.string(),
  primaryMuscle: z.string(),
  sets: z.array(WorkoutSetSchema),
  notes: z.string().optional()
});

const WorkoutSessionSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  exercises: z.array(WorkoutExerciseSchema),
  startTime: z.string(), // ISO date string
  endTime: z.string(), // ISO date string
  notes: z.string().optional()
});

// GET - Fetch user's workouts
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/workouts called'); // Debug log
    
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing'); // Debug log
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token length:', token.length); // Debug log
    
    let userId: string;
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
      console.log('User ID:', userId); // Debug log
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('Fetching workouts for user:', userId, 'limit:', limit, 'offset:', offset); // Debug log

    // Fetch workouts from Firestore
    const workoutsRef = adminDb
      .collection('workouts')
      .where('userId', '==', userId)
      .limit(limit);

    try {
      const snapshot = await workoutsRef.get();
      console.log('Firestore query successful, docs count:', snapshot.docs.length); // Debug log
      
      const workouts = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Workout doc data:', { id: doc.id, name: data.name, userId: data.userId }); // Debug log
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to ISO strings for frontend
          startTime: data.startTime?.toDate?.()?.toISOString() || data.startTime,
          endTime: data.endTime?.toDate?.()?.toISOString() || data.endTime,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        };
      });

      // Sort by startTime in memory (descending)
      workouts.sort((a, b) => {
        const dateA = new Date(a.startTime).getTime();
        const dateB = new Date(b.startTime).getTime();
        return dateB - dateA;
      });

      console.log(`Fetched ${workouts.length} workouts for user ${userId}`); // Debug log
      return NextResponse.json({ workouts });
    } catch (firestoreError) {
      console.error('Firestore query error:', firestoreError);
      const errorMessage = firestoreError instanceof Error ? firestoreError.message : 'Unknown error';
      const errorCode = (firestoreError as any)?.code || 'unknown';
      console.error('Error details:', errorMessage, errorCode); // More detailed error
      return NextResponse.json({ error: 'Database query failed', details: errorMessage }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error('Fetch workouts error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save new workout
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const body = await request.json();
    const workoutData = WorkoutSessionSchema.parse(body);

    // Calculate workout statistics
    const duration = Math.round(
      (new Date(workoutData.endTime).getTime() - new Date(workoutData.startTime).getTime()) / 60000
    );
    
    const totalSets = workoutData.exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
    const totalReps = workoutData.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + set.reps, 0), 0
    );
    const totalWeight = workoutData.exercises.reduce((sum, ex) => 
      sum + ex.sets.reduce((setSum, set) => setSum + (set.weight * set.reps), 0), 0
    );

    // Create workout document
    const workoutDoc = {
      userId,
      name: workoutData.name,
      category: workoutData.category,
      exercises: workoutData.exercises,
      startTime: new Date(workoutData.startTime),
      endTime: new Date(workoutData.endTime),
      duration, // minutes
      totalSets,
      totalReps,
      totalWeight, // kg
      notes: workoutData.notes || '',
      createdAt: new Date()
    };

    // Save to Firestore
    const docRef = await adminDb.collection('workouts').add(workoutDoc);

    // Update user's personal records
    await updatePersonalRecords(userId, workoutData.exercises);

    return NextResponse.json({ 
      success: true, 
      workoutId: docRef.id,
      stats: { duration, totalSets, totalReps, totalWeight }
    });
  } catch (error: unknown) {
    console.error('Save workout error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid workout data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to update personal records
async function updatePersonalRecords(userId: string, exercises: any[]) {
  try {
    const userRecordsRef = adminDb.collection('personalRecords').doc(userId);
    const userRecordsDoc = await userRecordsRef.get();
    
    let currentRecords: Record<string, any> = {};
    if (userRecordsDoc.exists) {
      currentRecords = userRecordsDoc.data() || {};
    }

    let hasNewRecords = false;

    for (const exercise of exercises) {
      const exerciseName = exercise.exerciseName;
      
      // Find the best set for this exercise (highest weight × reps)
      const bestSet = exercise.sets.reduce((best: any, current: any) => {
        const currentScore = current.weight * current.reps;
        const bestScore = best ? best.weight * best.reps : 0;
        return currentScore > bestScore ? current : best;
      }, null);

      if (bestSet && bestSet.weight > 0) {
        const currentRecord = currentRecords[exerciseName];
        const newScore = bestSet.weight * bestSet.reps;
        const currentScore = currentRecord ? currentRecord.weight * currentRecord.reps : 0;

        if (newScore > currentScore) {
          currentRecords[exerciseName] = {
            weight: bestSet.weight,
            reps: bestSet.reps,
            date: new Date().toISOString(),
            exerciseName
          };
          hasNewRecords = true;
        }
      }
    }

    if (hasNewRecords) {
      await userRecordsRef.set(currentRecords, { merge: true });
    }
  } catch (error: unknown) {
    console.error('Update personal records error:', error);
    // Don't fail the workout save if PR update fails
  }
}
