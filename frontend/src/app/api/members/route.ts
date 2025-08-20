import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { z } from 'zod';

/**
 * Admin email addresses with access to member management
 * These emails are authorized to view and manage all gym members
 * 
 * @constant {string[]} ADMIN_EMAILS
 */
const ADMIN_EMAILS = [
  "shahsadib25@gmail.com",
  "admin@fitlife.com",
];

/**
 * Zod validation schema for member data
 * 
 * Defines the structure and validation rules for member information:
 * - Required fields: firstName, lastName, email
 * - Optional fields: phone, dateOfBirth, address, city, zipCode
 * - Enumerated fields: membershipType, status
 * - Nested objects: emergencyContact, preferences
 * 
 * @constant {z.ZodObject} memberSchema
 */
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

/**
 * Retrieves all gym members (admin only)
 * 
 * This endpoint:
 * - Requires valid Firebase authentication token
 * - Restricts access to admin users only
 * - Supports filtering by status, membership type, and search terms
 * - Returns paginated member data with filtering applied
 * 
 * @async
 * @function GET
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with members array or error
 * 
 * @throws {401} Unauthorized - No valid authorization token provided
 * @throws {403} Forbidden - User is not an admin
 * @throws {500} Internal Server Error - Server processing error
 * 
 * @example
 * ```typescript
 * // Request with filters
 * GET /api/members?status=active&membershipType=premium&search=john
 * 
 * // Response
 * {
 *   "members": [
 *     {
 *       "id": "member123",
 *       "firstName": "John",
 *       "lastName": "Doe",
 *       "email": "john@example.com",
 *       "membershipType": "premium",
 *       "status": "active"
 *     }
 *   ]
 * }
 * ```
 */
export async function GET(request: NextRequest) {
  try {
    // Extract and validate authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    // Extract token from Bearer format
    const token = authHeader.replace('Bearer ', '');
    let userId: string;
    let userEmail: string;
    
    try {
      // Verify Firebase authentication token
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

    // Extract query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const membershipType = searchParams.get('membershipType');
    const search = searchParams.get('search');

    // Build Firestore query
    let query: any = adminDb.collection('members');

    // Apply status filter if specified
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    
    // Apply membership type filter if specified
    if (membershipType && membershipType !== 'all') {
      query = query.where('membershipType', '==', membershipType);
    }

    // Execute query and fetch results
    const snapshot = await query.get();
    let members = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as any[];

    // Apply search filter in memory (for text-based search)
    if (search) {
      const searchLower = search.toLowerCase();
      members = members.filter((member: any) => 
        member.firstName?.toLowerCase().includes(searchLower) ||
        member.lastName?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        `${member.firstName || ''} ${member.lastName || ''}`.toLowerCase().includes(searchLower)
      );
    }

    // Return successful response with filtered members
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
