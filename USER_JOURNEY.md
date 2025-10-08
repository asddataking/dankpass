# 🚀 DankPass User Journey

## Complete User Flow

### 1. **Discovery** 🌟
**Landing Page** (`/landing`)
- User arrives at landing page
- Sees compelling hero: "Turn Every Receipt Into Rewards"
- Views stats: 500+ partners, 50K+ users, 2M+ points
- Reads 4 key perks:
  - Exclusive Rewards
  - Build Your Tier
  - Instant Tracking
  - VIP Access
- **CTA**: "Join the Waitlist" form or "Sign Up" button in header

### 2. **Registration** ✍️
**Sign Up Page** (`/auth/signup`)
- User clicks "Sign Up"
- Stack Auth signup form appears
- User creates account with email/password
- Account created → Redirected to upload page

### 3. **First Impression** 📱
**Upload Page** (`/upload`) - First Visit
- User sees welcome message with their name
- Current points: 0
- Tier: Bronze (default)
- Empty receipts list (no uploads yet)
- Upload area prominently displayed
- **User thinks**: "Let me upload my first receipt!"

### 4. **First Upload** 📸
**Upload Process**
- User drags receipt photo or clicks to browse
- File preview appears
- User clicks "Upload Receipt"
- Loading state → Success!
- Alert: "Receipts uploaded successfully!"
- Points updated (mock: +10 points)

### 5. **The Upgrade Moment** ✨
**Upgrade Prompt** (1.5 seconds after upload)
- 🎉 Modal pops up: "Great First Upload!"
- Shows: "You earned 10 points. Nice start!"
- Explains premium benefits:
  - Could have earned **5 bonus points** with premium (1.5x)
  - Exclusive rewards & offers
  - Priority support
  - Points never expire
- Shows pricing: **$7/month**
- 30-day money-back guarantee

**User Choices:**
- **"Upgrade to Premium"** → Goes to premium page
- **"Maybe Later"** → Modal closes, continues using free

### 6A. **Free Tier Path** 🆓
**If user chooses "Maybe Later":**
- Can continue uploading receipts
- Earns 1x points
- Sees upgrade prompts in:
  - Dashboard: "Go Premium" button
  - Profile: Premium upgrade card
  - Can visit `/premium` anytime

**Regular Usage:**
- Upload receipts → Earn points
- Browse perks → Redeem rewards
- Check dashboard → Track progress
- **Can upgrade anytime!**

### 6B. **Premium Upgrade Path** 👑
**If user clicks "Upgrade to Premium":**

**Premium Page** (`/premium`)
- Sees all benefits explained
- Simple pricing: **$7/month**
- User clicks "Start Premium"

**Stripe Checkout**
- Redirected to Stripe
- Email pre-filled automatically
- Enters payment details
- Completes subscription
- Redirected back to: `/dashboard?success=true`

**Now Premium! 🎉**
- Premium badge visible
- 1.5x points on all uploads
- Access to exclusive perks
- No more upgrade prompts

### 7. **Regular Usage** 📈

**Dashboard** (`/dashboard`)
- Activity ring showing points progress
- Recent receipts list
- Tier display (Bronze → Silver → Gold)
- Premium badge (if premium)
- Quick stats: points, tier, recent activity

**Upload** (`/upload`)
- Upload new receipts
- See instant points (1x or 1.5x)
- Track upload history
- View pending/approved/rejected status

**Perks** (`/perks`)
- Browse available rewards
- Filter by partner type
- See point costs
- Redeem perks
- View active perks

**Profile** (`/profile`)
- View account details
- See total stats
- Manage settings
- **Premium card (if free tier)**
- Business owner CTA

### 8. **Growth & Engagement** 🌱

**Tier Progression:**
- **Bronze** (0-499 points) - Starting tier
- **Silver** (500-1,499 points) - Better perks
- **Gold** (1,500+ points) - Best rewards

**Point Sources:**
- Receipt uploads
- Premium multiplier (1.5x)
- Bonus promotions
- Referrals (future)

**Redemption:**
- Browse perks by category
- Check point balance
- Redeem instantly
- Show QR code at partner locations

### 9. **Partner Network** 🤝

**For Businesses** (`/join`)
- Two partner types:
  - Dispensaries
  - Restaurants
- See benefits of joining
- Submit application
- Get approved
- Start accepting DankPass

## Key Decision Points

### 1. Free vs Premium (After First Upload)
**Free Tier:**
- ✅ No cost
- ✅ Can still earn points
- ❌ 1x point multiplier
- ❌ Points expire after 12 months inactivity
- ❌ No exclusive perks

**Premium Tier:**
- ✅ 1.5x points on everything
- ✅ Exclusive rewards
- ✅ Points never expire
- ✅ Priority support
- ✅ VIP access
- ❌ $7/month cost

### 2. Premium Pricing
**Simple Monthly Plan:**
- $7/month
- Cancel anytime
- No long-term commitment
- All premium features included

## Success Metrics

**User Activation:**
- Sign up → First upload → Sees upgrade prompt
- Target: 80% of signups upload within 24 hours

**Premium Conversion:**
- See upgrade prompt → Visit premium → Subscribe
- Target: 15-20% conversion rate

**Retention:**
- Weekly active uploads
- Monthly perk redemptions
- Subscription renewal rate

## User Personas

### 1. **Casual User** (Free Tier)
- Occasional visits to dispensaries/restaurants
- Uploads 1-2 receipts per month
- Redeems small perks
- Happy with free tier

### 2. **Regular User** (Free → Premium)
- Frequent visits (weekly)
- Uploads 4-8 receipts per month
- Sees value in premium multiplier
- Upgrades after 2-3 uploads

### 3. **Power User** (Premium)
- Daily or multiple times per week
- Uploads 10+ receipts per month
- Maximizes rewards
- Refers friends
- Premium from the start

### 4. **Business Owner** (Partner)
- Owns dispensary or restaurant
- Joins partner network
- Gains customer loyalty
- Tracks redemptions

## Touchpoints Summary

| Screen | Purpose | Key CTA |
|--------|---------|---------|
| `/landing` | Capture interest | Sign Up / Join Waitlist |
| `/auth/signup` | Create account | Sign Up |
| `/upload` | First action | Upload Receipt |
| **Upgrade Prompt** | **Convert to premium** | **Upgrade / Maybe Later** |
| `/premium` | Show value | Choose Plan |
| `/dashboard` | Home base | Upload, View Stats |
| `/perks` | Redemption | Browse & Redeem |
| `/profile` | Account mgmt | Edit Profile |
| `/join` | B2B growth | Become Partner |

## Success Stories

### Story 1: "The Convert"
**Sarah, 28, Cannabis Consumer**
1. Saw Instagram ad → Visited landing page
2. Signed up out of curiosity
3. Uploaded receipt from dispensary
4. Saw upgrade prompt: "5 bonus points!"
5. Thought: "I go every week, that adds up!"
6. Upgraded to annual plan
7. Now saves $200/year on purchases

### Story 2: "The Foodie"
**Mike, 35, Restaurant Regular**
1. Friend referred him
2. Signed up, uploaded 3 receipts
3. Saw points add up (30 points)
4. Redeemed first perk: Free appetizer
5. Got hooked on rewards
6. Upgraded to premium for 1.5x
7. Uses app before every dinner out

### Story 3: "The Partner"
**Green Valley Dispensary Owner**
1. Heard about DankPass
2. Visited `/join` page
3. Filled out partner application
4. Got approved in 2 days
5. Now sees 50+ DankPass users weekly
6. Customer loyalty increased 35%
7. Plans to offer exclusive deals

---

**The Magic Moment**: When a user realizes they're earning rewards on purchases they already make. Premium feels like a no-brainer when they calculate the value. 💡

