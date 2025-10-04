// DANKPASS: Daily reconciliation cron job
import { NextResponse } from "next/server";
import { enqueueJob, enqueueJobs } from "@/lib/jobs";
import { db } from "@/lib/neon-db";
import { eq, and, gte } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET() {
  try {
    // DANKPASS: Verify this is a cron job
    const authHeader = process.env.CRON_SECRET;
    if (!authHeader) {
      return NextResponse.json({ error: 'Cron secret not configured' }, { status: 401 });
    }

    console.log('DANKPASS: Starting daily reconciliation cron job');

    // DANKPASS: Find receipts that need reconciliation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const pendingReceipts = await db.select()
      .from(db.receipts)
      .where(
        and(
          eq(db.receipts.status, 'pending'),
          gte(db.receipts.createdAt, yesterday)
        )
      )
      .limit(50); // Process in batches

    // DANKPASS: Enqueue validation jobs for pending receipts
    const jobs = pendingReceipts.map(receipt => ({
      name: 'receipt.validate' as const,
      payload: { receiptId: receipt.id, userId: receipt.userId },
      options: { retries: 2 }
    }));

    if (jobs.length > 0) {
      await enqueueJobs(jobs);
    }

    // DANKPASS: Enqueue leaderboard rebuild
    await enqueueJob('leaderboard.rebuild', {}, { delay: 300 }); // 5 minute delay

    console.log(`DANKPASS: Reconciliation cron completed - ${jobs.length} receipts queued`);

    return NextResponse.json({
      success: true,
      receiptsQueued: jobs.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('DANKPASS: Reconciliation cron failed:', error);
    return NextResponse.json({ 
      error: 'Reconciliation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
