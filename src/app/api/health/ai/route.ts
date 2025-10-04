// DANKPASS: AI Gateway health check
import { NextResponse } from "next/server";
import { generateChat } from "@/lib/ai";

export const runtime = "nodejs";

export async function GET() {
  try {
    // DANKPASS: Test AI Gateway with a simple prompt
    const response = await generateChat([
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Say 'OK' if you can hear me." }
    ]);

    if (!response.choices?.[0]?.message?.content) {
      throw new Error("Invalid response from AI Gateway");
    }

    return NextResponse.json({
      status: "healthy",
      gateway: "connected",
      model: process.env.AI_MODEL || "anthropic/claude-3-5-sonnet",
      response: response.choices[0].message.content
    });
  } catch (error) {
    console.error("AI Gateway health check failed:", error);
    return NextResponse.json(
      { 
        status: "unhealthy", 
        gateway: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 503 }
    );
  }
}
