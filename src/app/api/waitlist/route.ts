import { NextRequest, NextResponse } from 'next/server';

// Direct Neon connection details
const NEON_PROJECT_ID = 'floral-cell-89377091';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_wBrYDRgQ1en7@ep-misty-dew-ae0yf03m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Use Neon MCP to insert data
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(DATABASE_URL);

    // Check if email already exists
    const existing = await sql`
      SELECT email FROM waitlist WHERE email = ${email}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    // Insert new waitlist entry
    const result = await sql`
      INSERT INTO waitlist (name, email)
      VALUES (${name}, ${email})
      RETURNING id, name, email, created_at
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'Successfully joined the waitlist!'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Waitlist API error:', error);
    
    // Handle duplicate email constraint
    if (error.message?.includes('duplicate key value') || error.message?.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to join waitlist. Please try again.' },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch waitlist (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(DATABASE_URL);

    const waitlist = await sql`
      SELECT id, name, email, created_at 
      FROM waitlist 
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      count: waitlist.length,
      data: waitlist
    });

  } catch (error) {
    console.error('Waitlist GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch waitlist' },
      { status: 500 }
    );
  }
}

