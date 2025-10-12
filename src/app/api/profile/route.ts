import { NextRequest, NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { db } from '@/lib/db';
import { users, profiles } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's profile
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id as any),
    });

    if (!profile) {
      // Create profile if it doesn't exist
      const [newProfile] = await db.insert(profiles).values({
        userId: user.id as any,
      }).returning();
      
      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error getting profile:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();
    
    // Validate fields
    const allowedFields = ['firstName', 'lastName', 'phone', 'city', 'state', 'dateOfBirth', 'notificationPreferences'];
    const sanitizedUpdates: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Handle notification preferences specially to merge with existing
        if (key === 'notificationPreferences') {
          sanitizedUpdates[key] = value;
        } else {
          sanitizedUpdates[key] = value;
        }
      }
    }

    // Add updatedAt
    sanitizedUpdates.updatedAt = new Date();

    // Get existing profile to merge notification preferences
    if (updates.notificationPreferences) {
      const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.userId, user.id as any),
      });
      
      if (existingProfile?.notificationPreferences) {
        sanitizedUpdates.notificationPreferences = {
          ...existingProfile.notificationPreferences as any,
          ...updates.notificationPreferences,
        };
      }
    }

    // Check if profile exists
    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id as any),
    });

    if (!existingProfile) {
      // Create new profile
      const [newProfile] = await db.insert(profiles).values({
        userId: user.id as any,
        ...sanitizedUpdates,
      }).returning();
      
      return NextResponse.json({ profile: newProfile });
    }

    // Update existing profile
    const [updatedProfile] = await db.update(profiles)
      .set(sanitizedUpdates)
      .where(eq(profiles.userId, user.id as any))
      .returning();

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

