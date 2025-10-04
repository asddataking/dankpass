# DankPass - Weed + Food Loyalty Program

A Next.js loyalty program that rewards users for uploading receipts from dispensaries and restaurants. Users earn points that can be redeemed for rewards like social shoutouts, bonus clips, and sticker packs.

## Features

- 🧾 **Receipt Upload**: Upload receipts from dispensaries and restaurants
- 🤖 **AI Processing**: Automatic OCR and classification of receipts
- 🎯 **Points System**: Earn points for dispensary (10) and restaurant (8) receipts
- 🎁 **Rewards Store**: Redeem points for shoutouts, bonus clips, and sticker packs
- 👑 **Tier System**: Supporter, Mentor, and Ambassador tiers based on points
- 🔄 **Combo Bonus**: Extra 15 points for both types within 48 hours
- 👨‍💼 **Admin Panel**: Approve/deny receipts and manage redemptions
- 🔐 **Supabase Auth**: Magic link authentication
- 📱 **Mobile-First**: Responsive design with modern UI

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **OCR**: OpenAI Vision API or Tesseract.js
- **Icons**: Lucide React
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd dankpass
npm install
```

### 2. Environment Variables

Copy the example environment file and configure your variables:

```bash
cp env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Admin Configuration
ADMIN_EMAILS=dan@dankndevour.com,other@example.com

# Optional Integrations
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PRICE_ID_PLUS=price_plus_subscription_id
OPENAI_API_KEY=your-openai-api-key
OCR_PROVIDER=openai
DISCORD_WEBHOOK_URL=your-discord-webhook-url

# App Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql` in your Supabase SQL editor
3. Enable Row Level Security (RLS) policies
4. Create the `receipts` storage bucket

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── upload/        # Receipt upload endpoint
│   │   ├── redeem/        # Reward redemption endpoint
│   │   ├── me/            # User data endpoint
│   │   ├── agent/         # AI agent processing
│   │   └── admin/         # Admin management endpoints
│   ├── auth/              # Authentication pages
│   ├── upload/            # Receipt upload page
│   ├── me/                # User dashboard
│   ├── rewards/           # Rewards store
│   └── admin/             # Admin panel
├── components/            # Reusable components
│   ├── DankPassCard.tsx  # Digital loyalty card
│   └── AdminDashboard.tsx # Admin interface
└── lib/                   # Utility functions
    ├── supabase.ts        # Supabase client
    ├── auth.ts           # Authentication helpers
    ├── points.ts        # Points system
    ├── ocr.ts           # OCR processing
    ├── classify.ts      # Receipt classification
    ├── pHash.ts         # Duplicate detection
    └── rbac.ts          # Admin access control
```

## Database Schema

The app uses Supabase with the following main tables:

- **profiles**: User profile information
- **partners**: Dispensary and restaurant partners
- **receipts**: Uploaded receipt records
- **points_ledger**: Points transactions
- **redemptions**: Reward redemption records
- **agent_events**: AI processing logs

## AI Agent

The AI agent processes receipts automatically:

1. Downloads pending receipt images
2. Extracts text using OCR (OpenAI Vision or Tesseract)
3. Classifies receipts as dispensary/restaurant
4. Matches against known partners
5. Awards appropriate points
6. Checks for combo bonuses
7. Updates receipt status

## Points System

- **Dispensary Receipts**: 10 points
- **Restaurant Receipts**: 8 points
- **Combo Bonus**: 15 points (both types within 48 hours)
- **Tiers**: Supporter (<500), Mentor (<2000), Ambassador (≥2000)

## Rewards

- **Shoutout**: 50 points - Social media feature
- **Bonus Clip**: 75 points - Exclusive content access
- **Sticker Pack**: 150 points - Physical stickers mailed

## Admin Features

- View and approve/deny pending receipts
- Manage reward redemptions
- View partner information
- Monitor AI agent events
- Access restricted to admin email list

## Deployment

The app is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy to production
4. Configure custom domain (dankpass.dankndevour.com)

## Security

- Row Level Security (RLS) enabled on all tables
- Admin access controlled by email allowlist
- File upload validation and size limits
- Perceptual hash duplicate detection
- Daily upload limits per user

## Contributing

This is a private project for DankNDevour. For questions or issues, contact the development team.

## License

Private - All rights reserved.