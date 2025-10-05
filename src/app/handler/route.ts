// DANKPASS: Stack Auth handler route
import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/lib/stack'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return stackServerApp.handlers.GET(request)
}

export async function POST(request: NextRequest) {
  return stackServerApp.handlers.POST(request)
}
