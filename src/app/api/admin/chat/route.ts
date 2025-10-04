// DANKPASS: Admin chat API route using Vercel AI SDK streaming
import { NextRequest } from "next/server";
import { streamText, convertToCoreMessages } from "ai";
import { AI } from "@/lib/ai";
import { requireAdmin } from "@/lib/neon-auth";

export const runtime = "nodejs"; // or "edge" if preferred

export async function POST(req: NextRequest) {
  try {
    // DANKPASS: Require admin authentication
    await requireAdmin();
    
    const { messages } = await req.json();
    const core = convertToCoreMessages(messages);

    const result = await streamText({
      model: { 
        provider: "vercel", 
        id: AI.model, 
        baseURL: AI.baseURL, 
        apiKey: AI.apiKey 
      },
      messages: core,
      system: `You are DankPass Admin Assistant, an AI helper for managing the DankPass loyalty platform. You can help with:

- Receipt validation and processing
- User support and account management  
- Analytics and reporting
- System troubleshooting
- Partner management

Always be helpful, professional, and accurate. If you don't know something, say so rather than guessing.`,
      // DANKPASS: Optional: tool calls for "do a task" -> enqueue (see job system)
      // tools: [...]
    });

    return result.toAIStreamResponse();
  } catch (error) {
    console.error('Admin chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Chat service unavailable' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
