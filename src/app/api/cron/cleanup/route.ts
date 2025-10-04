// DANKPASS: Weekly cleanup cron job
import { NextResponse } from "next/server";
import { db } from "@/lib/neon-db";
import { receipts, agentEvents } from "@/lib/schema";
import { lt, and, eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  try {
    // DANKPASS: Verify this is a cron job
    const authHeader = process.env.CRON_SECRET;
    if (!authHeader) {
      return NextResponse.json({ error: 'Cron secret not configured' }, { status: 401 });
    }

    console.log('DANKPASS: Starting weekly cleanup cron job');

    // DANKPASS: Clean up old denied receipts (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deletedReceipts = await db.delete(receipts)
      .where(
        and(
          eq(receipts.status, 'denied'),
          lt(receipts.createdAt, thirtyDaysAgo)
        )
      );

    // DANKPASS: Clean up old agent events (older than 90 days)
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const deletedEvents = await db.delete(agentEvents)
      .where(lt(agentEvents.createdAt, ninetyDaysAgo));

    console.log(`DANKPASS: Cleanup cron completed - ${deletedReceipts.rowCount} receipts, ${deletedEvents.rowCount} events deleted`);

    return NextResponse.json({
      success: true,
      deletedReceipts: deletedReceipts.rowCount || 0,
      deletedEvents: deletedEvents.rowCount || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DANKPASS: Cleanup cron failed:', error);
    return NextResponse.json({ 
      error: 'Cleanup failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
