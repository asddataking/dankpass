import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample strains
  const strains = await Promise.all([
    prisma.strain.create({
      data: {
        name: 'Blue Dream',
        lineage: 'Blueberry x Haze',
        terpenes: 'Myrcene, Pinene, Caryophyllene',
        notes: 'A classic sativa-dominant hybrid known for its sweet berry aroma and uplifting effects.',
      },
    }),
    prisma.strain.create({
      data: {
        name: 'OG Kush',
        lineage: 'Chemdawg x Hindu Kush',
        terpenes: 'Limonene, Myrcene, Caryophyllene',
        notes: 'One of the most famous strains with earthy, pine, and lemon flavors.',
      },
    }),
    prisma.strain.create({
      data: {
        name: 'Girl Scout Cookies',
        lineage: 'OG Kush x Durban Poison',
        terpenes: 'Caryophyllene, Limonene, Humulene',
        notes: 'A potent hybrid with sweet and earthy flavors, known for its relaxing effects.',
      },
    }),
  ]);

  // Create sample activities
  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        name: 'Cannabis Cup 2024',
        location: 'Denver, CO',
        details: 'Annual cannabis competition and festival featuring top strains and products.',
      },
    }),
    prisma.activity.create({
      data: {
        name: '420 Festival',
        location: 'San Francisco, CA',
        details: 'Celebration of cannabis culture with music, food, and community.',
      },
    }),
  ]);

  // Create sample lodging
  const lodging = await Promise.all([
    prisma.lodging.create({
      data: {
        name: 'Cannabis Resort & Spa',
        location: 'Denver, CO',
        details: 'Luxury accommodation with cannabis-friendly amenities and spa services.',
      },
    }),
    prisma.lodging.create({
      data: {
        name: 'Green Valley Inn',
        location: 'Portland, OR',
        details: 'Boutique hotel offering cannabis concierge services and local dispensary partnerships.',
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${strains.length} strains, ${activities.length} activities, and ${lodging.length} lodging options.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
