import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Admin email addresses - same as frontend
const ADMIN_EMAILS = [
  "shahsadib25@gmail.com",
  "admin@fitlife.com",
];

// Validation schemas
const trainerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  bio: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive", "on_leave"]).default("active"),
  rating: z.number().min(0).max(5).default(5.0),
  sessionsCompleted: z.number().min(0).default(0),
  joinDate: z.string().optional(),
  hourlyRate: z.number().min(0).optional(),
  availability: z.object({
    monday: z.boolean().default(false),
    tuesday: z.boolean().default(false),
    wednesday: z.boolean().default(false),
    thursday: z.boolean().default(false),
    friday: z.boolean().default(false),
    saturday: z.boolean().default(false),
    sunday: z.boolean().default(false)
  }).optional()
});

// GET - Fetch all trainers
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    let userEmail: string;
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
      userEmail = decodedToken.email || '';
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin by email
    if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query: any = adminDb.collection('trainers');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.get();
    let trainers = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter in memory
    if (search) {
      const searchLower = search.toLowerCase();
      trainers = trainers.filter((trainer: any) => 
        trainer.name.toLowerCase().includes(searchLower) ||
        trainer.email.toLowerCase().includes(searchLower) ||
        trainer.specialties.some((s: string) => s.toLowerCase().includes(searchLower))
      );
    }

    return NextResponse.json({ trainers });
  } catch (error: unknown) {
    console.error('Fetch trainers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new trainer
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    let userEmail: string;
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
      userEmail = decodedToken.email || '';
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin by email
    if (!ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = trainerSchema.parse(body);
    
    // Check if email already exists
    const existingTrainer = await adminDb
      .collection('trainers')
      .where('email', '==', validatedData.email)
      .get();
    
    if (!existingTrainer.empty) {
      return NextResponse.json({ error: 'Trainer with this email already exists' }, { status: 400 });
    }

    // Create trainer document
    const trainerData = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId
    };

    const docRef = await adminDb.collection('trainers').add(trainerData);
    
    return NextResponse.json({ 
      success: true, 
      trainerId: docRef.id,
      message: 'Trainer created successfully'
    });
  } catch (error: unknown) {
    console.error('Create trainer error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid trainer data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
