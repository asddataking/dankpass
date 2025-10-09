import { NextResponse } from 'next/server';
import { stackServerApp } from '@/stack';
import { getOrCreateDbUser } from '@/lib/auth';
import { getUserReceipts } from '@/lib/receipt';

export async function GET() {
  try {
    // Get authenticated user from Stack Auth
    const user = await stackServerApp.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    const dbUser = await getOrCreateDbUser(user.id, user.primaryEmail || '');
    
    // Fetch user's receipts
    const receipts = await getUserReceipts(dbUser.id, 50);

    return NextResponse.json({
      receipts,
      count: receipts.length
    });
  } catch (error) {
    console.error('Error fetching user receipts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch receipts' },
      { status: 500 }
    );
  }
}

