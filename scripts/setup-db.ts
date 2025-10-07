import { db } from '../src/lib/db';
import { seedDatabase } from '../src/lib/seed';

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database...');
    
    // Run seed function
    await seedDatabase();
    
    console.log('🎉 Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
