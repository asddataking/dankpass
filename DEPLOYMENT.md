# Deployment Guide for DankPass

## Prerequisites

1. **Supabase Project**: Create a new Supabase project
2. **Vercel Account**: Sign up for Vercel
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note down your project URL and API keys

### 1.2 Database Setup
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase-schema.sql`
3. Run the SQL to create all tables, policies, and seed data

### 1.3 Storage Setup
1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `receipts`
3. Set it to private (not public)
4. Configure the storage policies as defined in the schema

### 1.4 Authentication Setup
1. Go to Authentication > Settings in Supabase
2. Configure your site URL: `https://dankpass.dankndevour.com`
3. Add redirect URLs:
   - `https://dankpass.dankndevour.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Step 2: Environment Variables

Set up the following environment variables in Vercel:

### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAILS=dan@dankndevour.com,other@example.com
NEXTAUTH_URL=https://dankpass.dankndevour.com
NEXTAUTH_SECRET=your-random-secret-key
```

### Optional Variables
```env
OPENAI_API_KEY=your-openai-key
OCR_PROVIDER=openai
DISCORD_WEBHOOK_URL=your-discord-webhook
STRIPE_SECRET_KEY=your-stripe-key
STRIPE_PRICE_ID_PLUS=your-price-id
```

## Step 3: Vercel Deployment

### 3.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `dankpass` folder as the root directory

### 3.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./dankpass`
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

### 3.3 Environment Variables
Add all the environment variables from Step 2 in the Vercel dashboard.

### 3.4 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be available at `https://your-project.vercel.app`

## Step 4: Custom Domain Setup

### 4.1 Add Domain in Vercel
1. Go to your project settings in Vercel
2. Click "Domains"
3. Add `dankpass.dankndevour.com`
4. Follow the DNS configuration instructions

### 4.2 DNS Configuration
Add a CNAME record in your DNS provider:
```
Type: CNAME
Name: dankpass
Value: cname.vercel-dns.com
```

### 4.3 Update Supabase Settings
1. Go to Supabase Authentication > Settings
2. Update Site URL to `https://dankpass.dankndevour.com`
3. Update redirect URLs to include the new domain

## Step 5: Post-Deployment Setup

### 5.1 Test Authentication
1. Visit `https://dankpass.dankndevour.com`
2. Try signing in with your admin email
3. Verify the magic link works

### 5.2 Test Upload Flow
1. Sign in to the app
2. Go to `/upload`
3. Upload a test receipt image
4. Verify it appears in the admin panel

### 5.3 Test Admin Panel
1. Go to `/admin`
2. Verify you can see pending receipts
3. Test approving/denying receipts

### 5.4 Set Up Cron Job (Optional)
To automatically process receipts, set up a cron job:

1. Go to Vercel Functions
2. Create a new cron job that calls `/api/agent/tick`
3. Set it to run every 5 minutes
4. Add `CRON_SECRET` environment variable

## Step 6: Monitoring and Maintenance

### 6.1 Monitor Logs
- Check Vercel function logs for errors
- Monitor Supabase logs for database issues
- Set up error tracking (Sentry, etc.)

### 6.2 Regular Maintenance
- Monitor pending receipts in admin panel
- Fulfill reward redemptions manually
- Update partner information as needed
- Monitor AI agent performance

## Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check Supabase site URL configuration
   - Verify redirect URLs are correct
   - Check environment variables

2. **File uploads failing**
   - Verify Supabase storage bucket exists
   - Check storage policies
   - Verify file size limits

3. **OCR not working**
   - Check OpenAI API key
   - Verify OCR_PROVIDER setting
   - Check API rate limits

4. **Admin access denied**
   - Verify ADMIN_EMAILS includes your email
   - Check email format (no spaces)

### Support
For deployment issues, check:
- Vercel deployment logs
- Supabase logs
- Browser console errors
- Network tab for failed requests

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Admin email list configured
- [ ] File upload validation working
- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Rate limiting implemented
- [ ] Error handling in place
