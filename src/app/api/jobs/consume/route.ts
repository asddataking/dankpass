// DANKPASS: Job consumer API route for QStash
import { NextRequest, NextResponse } from "next/server";
import { processJob } from "@/server/jobs/processor";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // DANKPASS: Verify QStash signature in production
    if (process.env.NODE_ENV === 'production') {
      const signature = req.headers.get('upstash-signature');
      if (!signature) {
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }
      // TODO: Implement signature verification
    }

    const body = await req.json();
    
    // DANKPASS: Validate job structure
    if (!body.name || !body.payload) {
      return NextResponse.json({ error: 'Invalid job format' }, { status: 400 });
    }

    console.log(`DANKPASS: Received job ${body.name}`, { 
      messageId: req.headers.get('upstash-message-id'),
      timestamp: body.timestamp 
    });

    // DANKPASS: Process the job
    const result = await processJob({ name: body.name, payload: body.payload });
    
    console.log(`DANKPASS: Job ${body.name} completed successfully`, { result });
    
    return NextResponse.json({ 
      success: true, 
      result,
      processedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('DANKPASS: Job processing failed:', error);
    
    // DANKPASS: Return error to trigger retry
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      failedAt: new Date().toISOString()
    }, { status: 500 });
  }
}

// DANKPASS: Health check for job consumer
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'job-consumer',
    timestamp: new Date().toISOString()
  });
}
