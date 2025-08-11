import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { sampleTrainers, sampleEquipment, sampleMembers } from '@/lib/seed-data';

// Admin email addresses - same as frontend
const ADMIN_EMAILS = [
  "shahsadib25@gmail.com",
  "admin@fitlife.com",
];

// POST - Initialize database with sample data
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

    const batch = adminDb.batch();
    const results = {
      trainers: 0,
      equipment: 0,
      members: 0
    };

    // Add sample trainers
    for (const trainer of sampleTrainers) {
      const trainerRef = adminDb.collection('trainers').doc();
      batch.set(trainerRef, {
        ...trainer,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId
      });
      results.trainers++;
    }

    // Add sample equipment
    for (const item of sampleEquipment) {
      const equipmentRef = adminDb.collection('equipment').doc();
      batch.set(equipmentRef, {
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId
      });
      results.equipment++;
    }

    // Add sample members
    for (const member of sampleMembers) {
      const memberRef = adminDb.collection('members').doc();
      batch.set(memberRef, {
        ...member,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: userId,
        fullName: `${member.firstName} ${member.lastName}`
      });
      results.members++;
    }

    // Commit the batch
    await batch.commit();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully',
      results
    });
  } catch (error: unknown) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
