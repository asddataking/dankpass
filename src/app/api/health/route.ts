import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get basic stats
    const strainCount = await prisma.strain.count();
    const activityCount = await prisma.activity.count();
    const lodgingCount = await prisma.lodging.count();
    
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      stats: {
        strains: strainCount,
        activities: activityCount,
        lodging: lodgingCount,
      },
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
