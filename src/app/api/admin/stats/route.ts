import { NextResponse } from 'next/server';
import { getUserStats } from '@/lib/user';
import { getPartnerStats } from '@/lib/partner';
import { getReceiptStats } from '@/lib/receipt';
import { getRedemptionStats } from '@/lib/perks';

export async function GET() {
  try {
    const [userStats, partnerStats, receiptStats, redemptionStats] = await Promise.all([
      getUserStats(),
      getPartnerStats(),
      getReceiptStats(),
      getRedemptionStats()
    ]);

    return NextResponse.json({
      users: userStats,
      partners: partnerStats,
      receipts: receiptStats,
      redemptions: redemptionStats
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
