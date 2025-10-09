# Stack Auth Email Verification Setup

## ✅ Your Code is Already Ready!

Your app is already configured to handle email verification through the `/handler/[...stack]` route. No code changes needed!

## 🔧 Stack Auth Dashboard Configuration

### Step 1: Access Your Stack Auth Dashboard

1. Go to: https://app.stack-auth.com/
2. Sign in and select your DankPass project
3. Find your project ID (should match your `STACK_PROJECT_ID` in `.env.local`)

### Step 2: Enable Email Verification

**Navigate to: Settings → Authentication → Email & Password**

Enable these settings:
- ✅ **Require email verification** - Users must verify before full access
- ✅ **Send verification email on signup** - Automatic email on registration
- ✅ **Allow sign-in before verification** (optional) - Users can sign in but see verification prompt

### Step 3: Configure Email Provider

**Navigate to: Settings → Emails**

Choose one:

**Option A: Use Stack's Default Email (Easiest)**
- ✅ Stack Auth sends emails from their domain
- ✅ Works immediately, no configuration needed
- ⚠️ Emails may go to spam (from noreply@stack-auth.com)

**Option B: Custom Email Provider (Recommended for Production)**
- Connect your own SMTP (Gmail, SendGrid, Postmark, etc.)
- Emails come from `noreply@dankpass.com`
- Better deliverability
- Professional branding

**For Gmail SMTP:**
```
SMTP Host: smtp.gmail.com
Port: 587
Username: your-email@gmail.com
Password: App Password (not your real password!)
```

**For SendGrid:**
```
SMTP Host: smtp.sendgrid.net
Port: 587
Username: apikey
Password: Your SendGrid API key
```

### Step 4: Configure URLs

**Navigate to: Settings → URLs & Redirects**

Set your app URLs:
```
Development URL: http://localhost:3000
Production URL: https://dankpass.vercel.app
```

Stack Auth automatically constructs verification URLs like:
```
http://localhost:3000/handler/verify-email?code=abc123&token=xyz
```

### Step 5: Customize Email Template (Optional)

**Navigate to: Settings → Emails → Templates**

Customize the verification email:
- Subject: "Verify your DankPass email 🔥"
- Body: Add your branding with "Earn & Burn" messaging
- CTA Button: "Verify Email & Start Earning"

Example template:
```
Hey there! 👋

Welcome to DankPass - where you earn free weed with every receipt!

Click the button below to verify your email and start earning points:

[Verify Email & Start Earning 🔥]

Once verified, you can:
✅ Upload receipts from dispensaries & restaurants
✅ Earn 10 points per $1 spent
✅ Burn points for free weed & exclusive perks

Happy earning & burning! 🔥🌿

- The DankPass Team
```

---

## 🧪 Testing Email Verification

### Test Flow:

1. **Sign up with a new email** (use temp email service like temp-mail.org)
2. **Check inbox** for verification email
3. **Click verification link** in email
4. Should redirect to: `http://localhost:3000/handler/verify-email?code=...`
5. Stack Auth processes verification
6. User is redirected to `/dashboard` (or shown success message)
7. User's email is marked as verified in Stack Auth

### Check Verification Status:

In your code, you can check if a user's email is verified:

```typescript
import { useUser } from '@stackframe/stack';

const user = useUser();
const isVerified = user?.primaryEmailVerified; // boolean

// Show verification banner if not verified
{!isVerified && (
  <div className="bg-yellow-100 border-yellow-400 p-4">
    ⚠️ Please verify your email to access all features
  </div>
)}
```

---

## 🔒 Require Verification for Features

### Option 1: Block Unverified Users

Add to your middleware or protected routes:

```typescript
// In middleware.ts
const user = await stackServerApp.getUser();

if (user && !user.primaryEmailVerified) {
  // Redirect to verification notice page
  return NextResponse.redirect(new URL('/verify-email-notice', request.url));
}
```

### Option 2: Soft Prompt (Better UX)

Show a banner but let them use the app:

```typescript
// In your dashboard or upload page
{user && !user.primaryEmailVerified && (
  <div className="card bg-yellow-50 border-yellow-400 mb-4">
    <h3>📧 Verify Your Email</h3>
    <p>Check your inbox and click the verification link.</p>
    <button onClick={resendEmail}>Resend Email</button>
  </div>
)}
```

---

## 🐛 Troubleshooting

### Issue: "Verification emails not sending"

**Solution:**
1. Check Stack Auth dashboard → Emails → Status
2. Verify email provider is connected
3. Check spam folder
4. Try Stack's default email provider first

### Issue: "Verification link doesn't work"

**Solution:**
1. Ensure development URL is set to `http://localhost:3000`
2. Check that `/handler/[...stack]/page.tsx` exists (it does!)
3. Verify no middleware is blocking the handler route
4. Check browser console for errors

### Issue: "User clicks link but still shows unverified"

**Solution:**
1. Clear browser cookies
2. Sign out and sign in again
3. Hard refresh the page
4. Check Stack Auth dashboard → Users → [user] → Verified status

---

## 🚀 Quick Setup Checklist

**In Stack Auth Dashboard:**
- [ ] Enable email verification
- [ ] Configure email provider (or use default)
- [ ] Set development URL: `http://localhost:3000`
- [ ] Set production URL: `https://dankpass.vercel.app`
- [ ] Customize email template (optional)

**In Your Code:**
- [x] `/handler/[...stack]/page.tsx` exists ✅
- [x] Stack Auth properly configured ✅
- [x] No middleware blocking handler routes ✅

**Test:**
- [ ] Sign up with new email
- [ ] Receive verification email
- [ ] Click link → redirects to app
- [ ] User is verified ✅

---

## 💡 Recommended: Add Verification Status UI

Want to show verification status in your app? Here's a component you can add:

```typescript
// src/components/EmailVerificationBanner.tsx
'use client';

import { useUser } from '@stackframe/stack';
import { Mail, CheckCircle } from 'lucide-react';

export function EmailVerificationBanner() {
  const user = useUser();
  
  if (!user || user.primaryEmailVerified) return null;
  
  const resendEmail = async () => {
    try {
      await fetch('/api/auth/resend-verification', {
        method: 'POST'
      });
      alert('Verification email sent! Check your inbox.');
    } catch (error) {
      alert('Failed to resend email. Try again later.');
    }
  };
  
  return (
    <div className="card bg-yellow-50 border-yellow-400 mb-4">
      <div className="flex items-start gap-3">
        <Mail className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-brand-ink mb-1">
            📧 Verify Your Email
          </h3>
          <p className="text-sm text-brand-subtle mb-2">
            We sent a verification link to <strong>{user.primaryEmail}</strong>
          </p>
          <button 
            onClick={resendEmail}
            className="text-sm text-brand-primary hover:text-brand-primary/80 font-medium"
          >
            Resend verification email
          </button>
        </div>
      </div>
    </div>
  );
}
```

Then add to your dashboard:
```typescript
import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';

// In your dashboard page
<EmailVerificationBanner />
```

---

## 📝 Summary

**Your app is ready!** You just need to:

1. **Go to Stack Auth dashboard**
2. **Enable email verification** in Settings
3. **Configure email provider** (or use default)
4. **Set your app URL**
5. **Test with a new signup**

The verification links will work automatically through your existing `/handler/[...stack]` route! 🚀

**No code changes needed** - it's all configuration in the Stack Auth dashboard.

---

Need help finding specific settings in the dashboard? Let me know! 📧

