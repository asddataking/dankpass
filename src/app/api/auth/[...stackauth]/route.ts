import { NextRequest, NextResponse } from 'next/server';

// Mock auth handler - replace with real Stack Auth when properly configured
export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Auth endpoint - not implemented yet' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Auth endpoint - not implemented yet' });
}
