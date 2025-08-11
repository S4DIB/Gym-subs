import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// GET - Fetch user's workout statistics
export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/workout-stats called'); // Debug log
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
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
    const period = searchParams.get('period') || 'week'; // week, month, year

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    console.log('Fetching stats for period:', period, 'from:', startDate.toISOString(), 'to:', now.toISOString()); // Debug log

    // Fetch workouts in the period
    const workoutsSnapshot = await adminDb
      .collection('workouts')
      .where('userId', '==', userId)
      .get();

    const workouts = workoutsSnapshot.docs.map(doc => doc.data());
    
    // Filter workouts by date in memory to avoid Firestore index issues
    const filteredWorkouts = workouts.filter(w => {
      const workoutDate = w.startTime?.toDate?.() || w.startTime;
      const workoutTime = new Date(workoutDate).getTime();
      return workoutTime >= startDate.getTime() && workoutTime <= now.getTime();
    });
    
    console.log('Total workouts found:', workouts.length, 'Filtered for period:', filteredWorkouts.length); // Debug log

    // Calculate statistics using filtered workouts
    const stats = {
      totalWorkouts: filteredWorkouts.length,
      totalDuration: filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0),
      totalSets: filteredWorkouts.reduce((sum, w) => sum + (w.totalSets || 0), 0),
      totalReps: filteredWorkouts.reduce((sum, w) => sum + (w.totalReps || 0), 0),
      totalWeight: filteredWorkouts.reduce((sum, w) => sum + (w.totalWeight || 0), 0),
      avgDuration: filteredWorkouts.length > 0 ? Math.round(filteredWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / filteredWorkouts.length) : 0,
      categories: {} as Record<string, number>
    };

    // Count workouts by category
    filteredWorkouts.forEach(workout => {
      const category = workout.category || 'Other';
      stats.categories[category] = (stats.categories[category] || 0) + 1;
    });

    // Calculate monthly goals progress (for current month)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthWorkouts = workouts.filter(w => {
      const workoutDate = w.startTime?.toDate?.() || w.startTime;
      return new Date(workoutDate).getTime() >= monthStart.getTime();
    });

    const monthlyProgress = {
      workouts: {
        current: monthWorkouts.length,
        target: 16 // This could be user-configurable
      },
      totalWeight: {
        current: monthWorkouts.reduce((sum, w) => sum + (w.totalWeight || 0), 0),
        target: 20000 // This could be user-configurable
      },
      avgDuration: {
        current: monthWorkouts.length > 0 
          ? Math.round(monthWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / monthWorkouts.length)
          : 0,
        target: 60 // This could be user-configurable
      }
    };

    return NextResponse.json({ stats, monthlyProgress, period });
  } catch (error: unknown) {
    console.error('Fetch workout stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
