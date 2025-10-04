# DankPass - Weed + Food Loyalty Program

A Next.js loyalty program that rewards users for uploading receipts from dispensaries and restaurants. Users earn points that can be redeemed for rewards like social shoutouts, bonus clips, and sticker packs. Built with Neon, Upstash Redis, and Vercel Edge Config for optimal performance and scalability.

## Features

- 🧾 **Receipt Upload**: Upload receipts from dispensaries and restaurants
- 🤖 **AI Processing**: Automatic OCR and classification of receipts via Vercel AI Gateway
- 🎯 **Points System**: Earn points for dispensary and restaurant receipts (configurable via Edge Config)
- 🎁 **Rewards Store**: Redeem points for shoutouts, bonus clips, and sticker packs
- 👑 **Tier System**: Supporter, Mentor, and Ambassador tiers based on points
- 🔄 **Combo Bonus**: Extra points for both types within 48 hours
- 👨‍💼 **Admin Panel**: Approve/deny receipts and manage redemptions
- 🔐 **Neon Auth**: Modern authentication with Stack Auth
- 📱 **Mobile-First**: Responsive design with modern UI
- ⚡ **Background Jobs**: Async processing with Vercel Queues/QStash
- 🕒 **Cron Jobs**: Scheduled tasks for reconciliation and cleanup

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon (PostgreSQL)
- **Authentication**: Neon Auth (Stack Auth)
- **Caching**: Upstash Redis
- **Configuration**: Vercel Edge Config
- **AI**: Vercel AI Gateway + AI SDK
- **Background Jobs**: Vercel Queues + Upstash QStash
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
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/me
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/me

# Admin Configuration
ADMIN_EMAILS=your-email@example.com

# Optional Integrations
OPENAI_API_KEY=your-openai-api-key
OCR_PROVIDER=openai
DISCORD_WEBHOOK_URL=your-discord-webhook-url
```

### 3. Database Setup

1. Create a Vercel Postgres database
2. Run the SQL schema from `vercel-postgres-schema.sql` in your database
3. Set up Vercel Blob for file storage
4. Configure Vercel KV for caching (optional)

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

The application uses Vercel Postgres with the following main tables:

- `users` - User profiles and authentication
- `partners` - Dispensary and restaurant partners
- `receipts` - Uploaded receipts and processing status
- `points_ledger` - Points transactions
- `redemptions` - Reward redemptions
- `agent_events` - AI agent processing logs

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

The app is designed to be deployed on Vercel with Clerk authentication:

1. Connect your GitHub repository to Vercel
2. Set up Clerk authentication
3. Add Vercel Postgres, Blob, KV, and Edge Config services
4. Set environment variables in Vercel dashboard
5. Deploy to production
6. Configure custom domain (dankpass.dankndevour.com)

## Security

- Clerk authentication with secure session management
- Admin access controlled by email allowlist
- File upload validation and size limits
- Perceptual hash duplicate detection
- Daily upload limits per user
- Vercel KV rate limiting

## AI Runtime

DankPass uses Vercel AI Gateway for all AI operations, providing a unified interface for LLM and embedding calls. The system includes:

### AI Gateway Configuration
- **Model**: Anthropic Claude 3.5 Sonnet (configurable via Gateway dashboard)
- **Embeddings**: OpenAI text-embedding-3-small
- **Health Check**: `/api/health/ai` endpoint for monitoring

### Background Jobs
- **Primary**: Vercel Queues (when available)
- **Fallback**: Upstash QStash for reliable job processing
- **Job Types**:
  - `receipt.process`: Process uploaded receipts
  - `receipt.validate`: AI-powered fraud detection
  - `points.award`: Award points to users
  - `leaderboard.rebuild`: Update leaderboard cache

### Scheduled Tasks (Vercel Cron)
- **Daily Reconciliation**: 3 AM UTC - User activity checks
- **Leaderboard Updates**: Every 6 hours - Refresh rankings
- **Weekly Cleanup**: Sundays - Remove old data

### Admin Chat
- **Endpoint**: `/admin/chat`
- **Features**: AI-powered admin assistant for managing the platform
- **Streaming**: Real-time responses using Vercel AI SDK

## Neon-Based Stack Configuration

### Core Services
- **Neon Database**: Primary PostgreSQL database with serverless scaling
- **Upstash Redis**: High-performance caching and rate limiting
- **Vercel Edge Config**: Global configuration and feature flags
- **Neon Auth**: Modern authentication with Stack Auth

### Environment Variables
```env
# Neon Database (Primary)
DATABASE_URL=postgresql://user:password@host/database
NEON_DATABASE_URL=postgresql://user:password@host/database

# Neon Auth (Stack Auth)
NEXT_PUBLIC_STACK_PROJECT_ID=your-neon-auth-project-id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your-neon-auth-publishable-key
STACK_SECRET_SERVER_KEY=your-neon-auth-secret-key

# Upstash Redis (Caching & Rate Limiting)
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Vercel Edge Config (Feature Flags & Configuration)
EDGE_CONFIG=your-edge-config-token

# AI Gateway
AI_GATEWAY_URL=https://gateway.ai.vercel.com/api/v1
AI_GATEWAY_KEY=your-gateway-key
AI_MODEL=anthropic/claude-3-5-sonnet
AI_EMBEDDING_MODEL=openai/text-embedding-3-small

# Background Jobs
VERCEL_QUEUE_NAME=dankpass-jobs
QSTASH_URL=https://qstash.upstash.io/v2/publish
QSTASH_TOKEN=your-qstash-token
JOB_CONSUMER_URL=https://your-app.vercel.app/api/jobs/consume
```

### Switching Models
Models can be changed via the Vercel AI Gateway dashboard without code changes. Simply update the `AI_MODEL` environment variable and redeploy.

### Job Queue Toggle
Switch between Vercel Queues and QStash by setting/removing the `VERCEL_QUEUE_NAME` environment variable. The system automatically detects and uses the appropriate queue.

## Contributing

This is a private project for DankNDevour. For questions or issues, contact the development team.

## License

Private - All rights reserved.