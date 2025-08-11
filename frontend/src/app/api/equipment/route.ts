import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Admin email addresses - same as frontend
const ADMIN_EMAILS = [
  "shahsadib25@gmail.com",
  "admin@fitlife.com",
];

// Validation schemas
const equipmentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["available", "in_use", "maintenance", "out_of_order"]).default("available"),
  location: z.string().optional(),
  purchaseDate: z.string().optional(),
  lastMaintenance: z.string().optional(),
  nextMaintenance: z.string().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]).default("good"),
  notes: z.string().optional(),
  serialNumber: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  warrantyExpiry: z.string().optional()
});

// GET - Fetch all equipment
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
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = adminDb.collection('equipment');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let equipment = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }));

    // Apply search filter in memory
    if (search) {
      const searchLower = search.toLowerCase();
      equipment = equipment.filter((item: any) => 
        item.name.toLowerCase().includes(searchLower) ||
        item.category.toLowerCase().includes(searchLower) ||
        item.location?.toLowerCase().includes(searchLower) ||
        item.manufacturer?.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ equipment });
  } catch (error: unknown) {
    console.error('Fetch equipment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new equipment
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
    const validatedData = equipmentSchema.parse(body);
    
    // Check if serial number already exists (if provided)
    if (validatedData.serialNumber) {
      const existingEquipment = await adminDb
        .collection('equipment')
        .where('serialNumber', '==', validatedData.serialNumber)
        .get();
      
      if (!existingEquipment.empty) {
        return NextResponse.json({ error: 'Equipment with this serial number already exists' }, { status: 400 });
      }
    }

    // Create equipment document
    const equipmentData = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId
    };

    const docRef = await adminDb.collection('equipment').add(equipmentData);
    
    return NextResponse.json({ 
      success: true, 
      equipmentId: docRef.id,
      message: 'Equipment added successfully'
    });
  } catch (error: unknown) {
    console.error('Create equipment error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid equipment data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
