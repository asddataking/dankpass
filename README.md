# DankPass MVP

A mobile-first web app that allows users to upload receipts from dispensaries and restaurants to earn points and redeem perks. Built as a "Reverse-Weedmaps" rewards platform.

## 🚀 Features

- **Mobile-First Design**: App-like interface with bottom navigation and smooth transitions
- **Receipt Upload**: Upload receipts to earn points from partner businesses
- **Points System**: Earn points for purchases, with premium members earning 1.5x points
- **Perks & Rewards**: Redeem points for discounts and exclusive perks
- **Premium Subscription**: $7/month premium tier with enhanced benefits
- **Partner Network**: Businesses can join to offer rewards to customers
- **Admin Dashboard**: Approve partners and manage receipts

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + Custom DankPass theme
- **Animations**: Framer Motion for smooth transitions
- **Database**: Drizzle ORM + Neon Postgres
- **Authentication**: Stack Auth (Neon Auth)
- **File Storage**: Vercel Blob for receipt uploads
- **Payments**: Stripe for premium subscriptions
- **Icons**: Lucide React

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#1F7AD4`
- **Dark Background**: `#08121E`
- **Mint Accent**: `#6EE7B7`
- **Lime Accent**: `#A3E635`

### Key Features
- Rounded corners (2xl/3xl)
- Glass morphism effects
- Blue gradient backgrounds
- Smooth animations and transitions
- Mobile-optimized touch targets

## 📱 Pages & Routes

### Public Routes
- `/` - Home/Explore page with Fitbit-style hero
- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/join` - Partner onboarding landing page
- `/join/dispensary` - Dispensary partner signup
- `/join/restaurant` - Restaurant partner signup

### Authenticated Routes (with bottom nav)
- `/dashboard` - User dashboard with stats and activity rings
- `/perks` - Perks and rewards marketplace
- `/upload` - Receipt upload interface
- `/profile` - User profile and settings
- `/premium` - Premium subscription page

### Partner Routes
- `/partner` - Partner dashboard for approved businesses

### Admin Routes
- `/admin` - Admin dashboard for approving partners and receipts

## 🗄 Database Schema

The app uses a comprehensive schema with the following main entities:

- **Users**: User accounts with roles (user, partner_dispensary, partner_restaurant, admin)
- **Profiles**: Extended user information
- **Memberships**: Premium subscription tracking
- **Partners**: Business partner information
- **Locations**: Partner business locations
- **Offers**: Rewards and discounts offered by partners
- **Receipts**: Uploaded receipts from users
- **Points Ledger**: Points transaction history
- **Perks**: Available rewards and perks
- **Redemptions**: Perk redemption tracking

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dankpass
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in the following variables:
   - `DATABASE_URL` - Neon Postgres connection string
   - `STACK_PROJECT_ID` - Stack Auth project ID
   - `STACK_PROJECT_URL` - Stack Auth project URL
   - `STRIPE_SECRET_KEY` - Stripe secret key
   - `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
   - `BLOB_READ_WRITE_TOKEN` - Vercel Blob token

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 Points System

### Earning Points
- **Base Rate**: 1 point per dollar spent
- **Premium Rate**: 1.5 points per dollar spent (Premium users)
- **In-Network Bonus**: 2x points at partner locations
- **Daily Cap**: 2000 points maximum per day

### Configuration
Points configuration is stored in environment variables:
- `POINTS_BASE=1`
- `POINTS_PREMIUM=1.5`
- `POINTS_INNETWORK=2`
- `DAILY_CAP=2000`

## 🎯 MVP Completion Status

✅ **Completed Features:**
- Homepage with Fitbit-style hero and CTA
- Authentication pages (sign in/sign up)
- Three user roles (User, Dispensary, Restaurant)
- Dashboard with bottom navigation and activity rings
- Receipt upload interface
- Perks marketplace with premium locks
- Premium subscription flow
- Blue gradient theme with smooth transitions
- Mobile-first responsive design
- Framer Motion animations throughout

🔄 **Remaining Tasks:**
- Stack Auth integration
- Vercel Blob integration for file uploads
- Stripe integration for payments
- Partner dashboard pages
- Admin dashboard pages
- Database seeding with sample data

## 🚀 Deployment

The app is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set up environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email support@dankpass.com or join our Discord community.
