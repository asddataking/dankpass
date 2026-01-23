import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from '@/lib/app-config';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.DASHBOARD,
      message: 'Please use the DankPass app to view your receipts'
    },
    { status: 410 }
  );
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.UPLOAD,
      message: 'Please use the DankPass app to upload receipts'
    },
    { status: 410 }
  );
}
