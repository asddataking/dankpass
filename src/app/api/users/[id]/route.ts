import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile, updateUserProfile, getUserActivity } from '@/lib/user';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const includeActivity = searchParams.get('includeActivity') === 'true';
    
    const profile = await getUserProfile(id);
    
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let activity = undefined;
    if (includeActivity) {
      activity = await getUserActivity(id);
    }

    return NextResponse.json({ 
      user: profile,
      activity
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    const updatedProfile = await updateUserProfile(id, {
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      phone: data.phone,
      avatar: data.avatar
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      profile: updatedProfile[0]
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
