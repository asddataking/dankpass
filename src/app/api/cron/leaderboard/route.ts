// DANKPASS: Leaderboard rebuild cron job
import { NextResponse } from "next/server";
import { enqueueJob } from "@/lib/jobs";

export const runtime = "nodejs";

export async function GET() {
  try {
    // DANKPASS: Verify this is a cron job
    const authHeader = process.env.CRON_SECRET;
    if (!authHeader) {
      return NextResponse.json({ error: 'Cron secret not configured' }, { status: 401 });
    }

    console.log('DANKPASS: Starting leaderboard rebuild cron job');

    // DANKPASS: Enqueue leaderboard rebuild job
    await enqueueJob('leaderboard.rebuild', {}, { retries: 2 });

    console.log('DANKPASS: Leaderboard rebuild cron completed');

    return NextResponse.json({
      success: true,
      message: 'Leaderboard rebuild queued',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DANKPASS: Leaderboard cron failed:', error);
    return NextResponse.json({ 
      error: 'Leaderboard rebuild failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
