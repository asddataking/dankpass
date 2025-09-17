# DankPass - Cannabis Connoisseur Passport

A GTA Vice City inspired web app for cannabis connoisseurs to collect stamps, track strains, and unlock the culture.

## Features

- 🎯 **QR Code Scanning**: Scan QR codes at dispensaries, events, and lodging
- 🌿 **Strain Logging**: Track cannabis experiences with detailed information
- 🏨 **Activity & Lodging**: Log experiences at cannabis-friendly locations
- 📱 **Mobile-First**: Responsive design with retro neon aesthetics
- 🔐 **Magic Link Auth**: Secure email-based authentication
- 🎨 **Retro Neon Theme**: Pink and cyan gradients on black background
- 📊 **Admin Panel**: B2B tools for creating stamps and managing QR codes
- 🖼️ **Shareable Images**: Generate OG images for social sharing

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom neon theme
- **Database**: Neon PostgreSQL
- **ORM**: Prisma
- **Authentication**: Neon Stack Auth with direct database integration
- **Email**: Nodemailer
- **QR Codes**: qrcode library
- **Icons**: Lucide React
- **Image Generation**: @vercel/og
- **Validation**: Zod

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
# Database - Pooled connection for applications (recommended for serverless)
DATABASE_URL="postgresql://username:password@ep-your-project-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require&connect_timeout=15&connection_limit=20&pool_timeout=15"

# Database - Direct connection for Prisma Migrate and CLI operations
DIRECT_URL="postgresql://username:password@ep-your-project.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require"

# Neon Stack Auth environment variables
NEXT_PUBLIC_STACK_PROJECT_ID=YOUR_NEON_AUTH_PROJECT_ID
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=YOUR_NEON_AUTH_PUBLISHABLE_KEY
STACK_SECRET_SERVER_KEY=YOUR_NEON_AUTH_SECRET_KEY

# Other environment variables
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@dankndevour.com"
ASSET_BASE_URL="https://dankndevour.com"
```

### 3. Database Setup

Generate Prisma client and push schema to database:

```bash
npm run db:generate
npm run db:push
```

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
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run schema:apply` - Apply schema changes (Neon MCP)
- `npm run schema:diff` - Show schema differences (Neon MCP)
- `npm run sql` - Open database studio (Neon MCP)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth configuration
│   │   └── og/            # OG image generation
│   ├── auth/              # Authentication pages
│   ├── admin/             # Admin panel
│   ├── passport/          # User passport dashboard
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                   # Utility functions and configurations
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Prisma client
│   ├── schemas.ts        # Zod validation schemas
│   └── utils.ts          # Utility functions
└── styles/               # Global styles
```

## Neon MCP Configuration

The project includes Neon MCP configuration for database management:

- **File**: `mcp/neon.json`
- **Capabilities**: SQL execution, schema management
- **Scripts**: Database operations via npm scripts

## Optimized Database Connection

This project uses Neon's optimized connection setup for better performance:

- **Pooled Connection**: `DATABASE_URL` uses connection pooling (`-pooler` endpoint) for applications
- **Direct Connection**: `DIRECT_URL` uses direct connection for Prisma Migrate and CLI operations
- **Connection Parameters**: Optimized timeout and pool settings for serverless environments
- **Benefits**: Better performance, reduced connection overhead, and improved scalability

For more details, see the [Neon Prisma documentation](https://neon.com/docs/guides/prisma#use-connection-pooling-with-prisma).

## Authentication Flow

1. User visits sign-in page (`/handler/sign-in`)
2. Neon Stack Auth handles authentication
3. User data syncs directly to Neon database
4. Redirected to passport dashboard

## Admin Panel Features

- Create strain stamps with QR codes
- Create activity and lodging stamps
- Generate QR codes for existing stamps
- View analytics and user management
- Export data functionality

## Styling Guidelines

- **Colors**: Neon pink (#ff0080), cyan (#00ffff), purple (#8000ff)
- **Background**: Dark theme (#0a0a0a)
- **Fonts**: Orbitron (retro), Exo 2 (neon)
- **Animations**: Glow effects, hover states, floating elements
- **Components**: Rounded corners (rounded-2xl), gradient buttons

## Deployment

The app is designed to be deployed on Vercel with Neon PostgreSQL:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy to production
4. Configure custom domain (dankndevour.com/dankpass)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the DankNDevour ecosystem.