import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from '@/lib/app-config';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.PROFILE,
      message: 'Please use the DankPass app to view your profile'
    },
    { status: 410 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.PROFILE,
      message: 'Please use the DankPass app to update your profile'
    },
    { status: 410 }
  );
}
