# Stack Auth Redirect Domains Setup

## Current Configuration

### Redirect URLs to Add in Stack Auth Dashboard

Add the following URLs to your Stack Auth project's allowed redirect domains:

1. **Production**: `https://dankpass.vercel.app`
2. **Development**: `http://localhost:3000`

### How to Configure in Stack Auth

1. Go to your Stack Auth dashboard
2. Navigate to your project settings
3. Find the "Allowed Redirect URLs" or "Callback URLs" section
4. Add the following URLs:
   - Production: `https://dankpass.vercel.app/handler/sign-in`
   - Production: `https://dankpass.vercel.app/handler/sign-up`
   - Local: `http://localhost:3000/handler/sign-in`
   - Local: `http://localhost:3000/handler/sign-up`

### Post-Login Behavior

Users are now redirected to the **Upload Receipt** screen (`/upload`) after:
- Signing in
- Signing up

This screen displays:
- User's name (from Stack Auth profile)
- Current points balance
- Upload interface for receipts
- Recent upload history

### Files Modified

- `src/stack.ts` - Updated `afterSignIn` and `afterSignUp` routes to `/upload`
- `src/app/(app)/upload/page.tsx` - Added user profile display with name and points

### Environment Variables Required

Make sure these are set in your `.env.local`:
```
NEXT_PUBLIC_STACK_PROJECT_ID=your_project_id
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_client_key
STACK_SECRET_SERVER_KEY=your_secret_key
```

