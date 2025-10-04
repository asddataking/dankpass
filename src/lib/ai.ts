// DANKPASS: Unified AI client through Vercel AI Gateway
export const AI = {
  baseURL: process.env.AI_GATEWAY_URL!,
  apiKey: process.env.AI_GATEWAY_KEY!,
  model: process.env.AI_MODEL || "anthropic/claude-3-5-sonnet",
  embedModel: process.env.AI_EMBEDDING_MODEL || "openai/text-embedding-3-small",
};

// DANKPASS: Simple chat completion helper
export async function generateChat(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  tools?: any[]
) {
  const res = await fetch(`${AI.baseURL}/chat/completions`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${AI.apiKey}` 
    },
    body: JSON.stringify({ 
      model: AI.model, 
      messages, 
      tools,
      temperature: 0.7,
      max_tokens: 1000
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AI Gateway error: ${res.status} - ${errorText}`);
  }
  
  return res.json();
}

// DANKPASS: Embedding helper
export async function embed(input: string[]) {
  const res = await fetch(`${AI.baseURL}/embeddings`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      "Authorization": `Bearer ${AI.apiKey}` 
    },
    body: JSON.stringify({ 
      model: AI.embedModel, 
      input 
    }),
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AI Gateway embed error: ${res.status} - ${errorText}`);
  }
  
  return res.json();
}

// DANKPASS: Receipt classification helper
export async function classifyReceiptWithAI(receiptText: string, vendor: string) {
  const messages = [
    {
      role: "system" as const,
      content: `You are a receipt classification AI for DankPass. Analyze receipts and classify them as either "dispensary" or "restaurant" based on the vendor name and content. Return only the classification and confidence (0-1).`
    },
    {
      role: "user" as const,
      content: `Vendor: ${vendor}\nReceipt Text: ${receiptText}\n\nClassify this receipt as either "dispensary" or "restaurant" and provide confidence.`
    }
  ];

  const response = await generateChat(messages);
  const content = response.choices[0]?.message?.content || "unknown";
  
  // Parse the response to extract classification and confidence
  const lowerContent = content.toLowerCase();
  const isDispensary = lowerContent.includes('dispensary');
  const isRestaurant = lowerContent.includes('restaurant');
  
  let kind: 'dispensary' | 'restaurant' | 'unknown' = 'unknown';
  let confidence = 0.5;
  
  if (isDispensary && !isRestaurant) {
    kind = 'dispensary';
    confidence = 0.8;
  } else if (isRestaurant && !isDispensary) {
    kind = 'restaurant';
    confidence = 0.8;
  }
  
  return { kind, confidence };
}

// DANKPASS: OCR text extraction helper
export async function extractTextFromImageWithAI(imageBuffer: Buffer) {
  // For now, return a placeholder since we need to implement image analysis
  // This would typically use a vision model through the AI Gateway
  return {
    vendor: "Unknown Vendor",
    total: 0,
    date: new Date().toISOString(),
    items: []
  };
}

// DANKPASS: Health check helper
export async function healthCheck() {
  try {
    const response = await generateChat([
      { role: "user", content: "Hello" }
    ]);
    return { 
      status: "healthy", 
      model: AI.model,
      response: response.choices[0]?.message?.content || "No response"
    };
  } catch (error) {
    return { 
      status: "unhealthy", 
      model: AI.model,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
