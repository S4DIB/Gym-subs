import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

// Validation schemas
const memberSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),
  membershipType: z.enum(["basic", "premium", "vip"]).default("basic"),
  status: z.enum(["active", "inactive", "suspended", "expired"]).default("active"),
  joinDate: z.string().optional(),
  subscriptionId: z.string().optional(),
  emergencyContact: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional()
  }).optional(),
  preferences: z.object({
    emailNotifications: z.boolean().default(true),
    smsNotifications: z.boolean().default(false),
    workoutReminders: z.boolean().default(true),
    classReminders: z.boolean().default(true)
  }).optional()
});

// GET - Fetch all members
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const membershipType = searchParams.get('membershipType');
    const search = searchParams.get('search');

    let query: any = adminDb.collection('members');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (membershipType && membershipType !== 'all') {
      query = query.where('membershipType', '==', membershipType);
    }

    const snapshot = await query.get();
    let members = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Apply search filter in memory
    if (search) {
      const searchLower = search.toLowerCase();
      members = members.filter(member => 
        member.firstName?.toLowerCase().includes(searchLower) ||
        member.lastName?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({ members });
  } catch (error: unknown) {
    console.error('Fetch members error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new member
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      userId = decodedToken.uid;
    } catch (authError) {
      console.error('Auth error:', authError);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const userDoc = await adminDb.collection('users').doc(userId).get();
    if (!userDoc.exists || !userDoc.data()?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = memberSchema.parse(body);
    
    // Check if email already exists
    const existingMember = await adminDb
      .collection('members')
      .where('email', '==', validatedData.email)
      .get();
    
    if (!existingMember.empty) {
      return NextResponse.json({ error: 'Member with this email already exists' }, { status: 400 });
    }

    // Create member document
    const memberData = {
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      fullName: `${validatedData.firstName} ${validatedData.lastName}`
    };

    const docRef = await adminDb.collection('members').add(memberData);
    
    return NextResponse.json({ 
      success: true, 
      memberId: docRef.id,
      message: 'Member created successfully'
    });
  } catch (error: unknown) {
    console.error('Create member error:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid member data', details: (error as any).errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
