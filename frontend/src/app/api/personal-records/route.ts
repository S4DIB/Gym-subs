import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// GET - Fetch user's personal records
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Fetch personal records from Firestore
    const recordsDoc = await adminDb.collection('personalRecords').doc(userId).get();
    
    let records = [];
    if (recordsDoc.exists) {
      const data = recordsDoc.data() || {};
      records = Object.values(data);
    }

    return NextResponse.json({ records });
  } catch (error: unknown) {
    console.error('Fetch personal records error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
