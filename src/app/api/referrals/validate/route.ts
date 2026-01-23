import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from '@/lib/app-config';

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.DASHBOARD,
      message: 'Please use the DankPass app to validate referral codes'
    },
    { status: 410 }
  );
}
