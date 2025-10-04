// DANKPASS: Job processor for background tasks
import { generateChat, classifyReceiptWithAI } from "@/lib/ai";
import { db } from "@/lib/neon-db";
import { addPoints, getUserPointsTotal, updateReceipt, createAgentEvent } from "@/lib/neon-db";
import { updateLeaderboard, getLeaderboard } from "@/lib/upstash-redis";
import { JobName, JobPayload } from "@/lib/jobs";

export async function processJob({ name, payload }: { name: JobName; payload: any }) {
  console.log(`DANKPASS: Processing job ${name}`, { payload });
  
  try {
    switch (name) {
      case "receipt.validate":
        return await validateReceipt(payload);
      
      case "points.award":
        return await awardPoints(payload);
      
      case "leaderboard.rebuild":
        return await rebuildLeaderboard();
      
      case "receipt.process":
        return await processReceipt(payload);
      
      case "user.notify":
        return await notifyUser(payload);
      
      default:
        throw new Error(`Unknown job: ${name}`);
    }
  } catch (error) {
    console.error(`DANKPASS: Job ${name} failed:`, error);
    throw error; // Re-throw to trigger retry
  }
}

// DANKPASS: Validate receipt with AI
async function validateReceipt({ receiptId, userId }: JobPayload['receipt.validate']) {
  const receipt = await db.select().from(db.receipts).where(db.receipts.id.eq(receiptId)).limit(1);
  
  if (!receipt.length) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  const receiptData = receipt[0];
  
  // DANKPASS: Use AI to validate receipt authenticity
  const validationResult = await generateChat([
    {
      role: "system",
      content: `You are a strict receipt validator for DankPass. Analyze receipts for authenticity and fraud detection. Return JSON with: { "valid": boolean, "confidence": number, "reason": string, "fraud_indicators": string[] }`
    },
    {
      role: "user",
      content: `Validate this receipt:
Vendor: ${receiptData.vendor || 'Unknown'}
Amount: ${receiptData.totalAmountCents ? (receiptData.totalAmountCents / 100) : 'Unknown'}
Date: ${receiptData.receiptDate || 'Unknown'}
Kind: ${receiptData.kind || 'Unknown'}
User ID: ${userId}`
    }
  ]);

  const validation = JSON.parse(validationResult.choices[0]?.message?.content || '{"valid": false, "confidence": 0, "reason": "Parse error"}');
  
  // DANKPASS: Update receipt based on validation
  await updateReceipt(receiptId, {
    status: validation.valid ? 'approved' : 'denied',
    denyReason: validation.valid ? null : validation.reason,
    approvedAt: validation.valid ? new Date() : null
  });

  // DANKPASS: Award points if valid
  if (validation.valid) {
    const basePoints = receiptData.kind === 'dispensary' ? 10 : 8;
    await addPoints(userId, basePoints, 'receipt', receiptId);
    
    // DANKPASS: Update leaderboard
    await updateLeaderboard(userId, await getUserPointsTotal(userId));
  }

  // DANKPASS: Log agent event
  await createAgentEvent(receiptId, 'validated', {
    validation,
    points_awarded: validation.valid ? (receiptData.kind === 'dispensary' ? 10 : 8) : 0
  });

  return { receiptId, valid: validation.valid, confidence: validation.confidence };
}

// DANKPASS: Award points to user
async function awardPoints({ userId, amount, reason, receiptId }: JobPayload['points.award']) {
  await addPoints(userId, amount, reason, receiptId);
  
  // DANKPASS: Update leaderboard
  const totalPoints = await getUserPointsTotal(userId);
  await updateLeaderboard(userId, totalPoints);
  
  return { userId, amount, totalPoints };
}

// DANKPASS: Rebuild leaderboard from database
async function rebuildLeaderboard() {
  // DANKPASS: Get all users with their point totals
  const users = await db.select({
    userId: db.points.userId,
    totalPoints: db.points.amount
  }).from(db.points)
    .groupBy(db.points.userId)
    .orderBy(db.points.amount);

  // DANKPASS: Update leaderboard cache
  for (const user of users) {
    await updateLeaderboard(user.userId, user.totalPoints);
  }

  return { usersProcessed: users.length };
}

// DANKPASS: Process receipt with AI (OCR + classification)
async function processReceipt({ receiptId }: JobPayload['receipt.process']) {
  const receipt = await db.select().from(db.receipts).where(db.receipts.id.eq(receiptId)).limit(1);
  
  if (!receipt.length) {
    throw new Error(`Receipt ${receiptId} not found`);
  }

  const receiptData = receipt[0];
  
  // DANKPASS: Classify receipt with AI
  const classification = await classifyReceiptWithAI(
    `Receipt from ${receiptData.vendor || 'Unknown'}`,
    receiptData.vendor || 'Unknown'
  );

  // DANKPASS: Update receipt with classification
  await updateReceipt(receiptId, {
    kind: classification.kind,
    status: 'approved',
    approvedAt: new Date()
  });

  // DANKPASS: Award points
  const basePoints = classification.kind === 'dispensary' ? 10 : 8;
  await addPoints(receiptData.userId, basePoints, 'receipt', receiptId);

  // DANKPASS: Update leaderboard
  await updateLeaderboard(receiptData.userId, await getUserPointsTotal(receiptData.userId));

  // DANKPASS: Log agent event
  await createAgentEvent(receiptId, 'processed', {
    classification,
    points_awarded: basePoints
  });

  return { receiptId, classification, pointsAwarded: basePoints };
}

// DANKPASS: Notify user (placeholder for future implementation)
async function notifyUser({ userId, message, type }: JobPayload['user.notify']) {
  // DANKPASS: Placeholder for user notification system
  console.log(`DANKPASS: Would notify user ${userId} with ${type}: ${message}`);
  
  // TODO: Implement actual notification (email, push, SMS, etc.)
  
  return { userId, message, type, notified: true };
}
