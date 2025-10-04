// DANKPASS: Background job system with QStash (Vercel Queues not yet available)
import { Client } from '@upstash/qstash';

// DANKPASS: Initialize QStash client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

// DANKPASS: Job types for type safety
export type JobName = 
  | 'receipt.validate'
  | 'points.award'
  | 'leaderboard.rebuild'
  | 'receipt.process'
  | 'user.notify';

export interface JobPayload {
  'receipt.validate': { receiptId: string; userId: string };
  'points.award': { userId: string; amount: number; reason: string; receiptId?: string };
  'leaderboard.rebuild': Record<string, never>;
  'receipt.process': { receiptId: string; imageBuffer?: Buffer };
  'user.notify': { userId: string; message: string; type: 'email' | 'push' };
}

// DANKPASS: Enqueue job with retry logic
export async function enqueueJob<T extends JobName>(
  name: T, 
  payload: JobPayload[T],
  options: {
    delay?: number; // seconds
    retries?: number;
    headers?: Record<string, string>;
  } = {}
) {
  const { delay = 0, retries = 3, headers = {} } = options;
  
  try {
    const jobData = {
      name,
      payload,
      timestamp: new Date().toISOString(),
      retries: 0,
      maxRetries: retries
    };

    const response = await qstash.publishJSON({
      url: process.env.JOB_CONSUMER_URL!,
      body: jobData,
      delay,
      retries,
      headers: {
        'Content-Type': 'application/json',
        'X-Job-Name': name,
        ...headers
      }
    });

    console.log(`DANKPASS: Enqueued job ${name}`, { messageId: response.messageId, delay, retries });
    return response;
  } catch (error) {
    console.error(`DANKPASS: Failed to enqueue job ${name}:`, error);
    throw new Error(`Failed to enqueue job ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// DANKPASS: Batch enqueue multiple jobs
export async function enqueueJobs<T extends JobName>(
  jobs: Array<{ name: T; payload: JobPayload[T]; options?: Parameters<typeof enqueueJob>[2] }>
) {
  const results = await Promise.allSettled(
    jobs.map(job => enqueueJob(job.name, job.payload, job.options))
  );

  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  console.log(`DANKPASS: Batch enqueue completed: ${successful} successful, ${failed} failed`);
  
  return { successful, failed, results };
}

// DANKPASS: Schedule recurring job (for cron-like behavior)
export async function scheduleRecurringJob<T extends JobName>(
  name: T,
  payload: JobPayload[T],
  cron: string,
  options: { headers?: Record<string, string> } = {}
) {
  try {
    const jobData = {
      name,
      payload,
      timestamp: new Date().toISOString(),
      recurring: true,
      cron
    };

    const response = await qstash.publishJSON({
      url: process.env.JOB_CONSUMER_URL!,
      body: jobData,
      cron,
      headers: {
        'Content-Type': 'application/json',
        'X-Job-Name': name,
        'X-Recurring': 'true',
        ...options.headers
      }
    });

    console.log(`DANKPASS: Scheduled recurring job ${name} with cron ${cron}`, { messageId: response.messageId });
    return response;
  } catch (error) {
    console.error(`DANKPASS: Failed to schedule recurring job ${name}:`, error);
    throw new Error(`Failed to schedule recurring job ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// DANKPASS: Cancel a scheduled job
export async function cancelJob(messageId: string) {
  try {
    await qstash.messages.delete(messageId);
    console.log(`DANKPASS: Cancelled job ${messageId}`);
    return true;
  } catch (error) {
    console.error(`DANKPASS: Failed to cancel job ${messageId}:`, error);
    return false;
  }
}

// DANKPASS: Get job status
export async function getJobStatus(messageId: string) {
  try {
    const message = await qstash.messages.get(messageId);
    return {
      messageId,
      status: (message as unknown as { status?: string }).status || 'unknown',
      createdAt: (message as unknown as { createdAt?: number }).createdAt,
      scheduledFor: (message as unknown as { scheduledFor?: number }).scheduledFor,
      deliveredAt: (message as unknown as { deliveredAt?: number }).deliveredAt,
      attempts: (message as unknown as { attempts?: number }).attempts
    };
  } catch (error) {
    console.error(`DANKPASS: Failed to get job status ${messageId}:`, error);
    return null;
  }
}
