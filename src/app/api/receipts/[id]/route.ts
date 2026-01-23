import { NextRequest, NextResponse } from 'next/server';
import { APP_ROUTES } from '@/lib/app-config';

export async function GET(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.DASHBOARD,
      message: 'Please use the DankPass app to view receipt details'
    },
    { status: 410 }
  );
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.DASHBOARD,
      message: 'Please use the DankPass app to update receipts'
    },
    { status: 410 }
  );
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'This endpoint has been moved to the DankPass app',
      redirect: APP_ROUTES.DASHBOARD,
      message: 'Please use the DankPass app to delete receipts'
    },
    { status: 410 }
  );
}
