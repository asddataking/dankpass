# Logo Setup Instructions

## ✅ Completed:
- Created reusable Logo component (`src/components/Logo.tsx`)
- Updated favicon configuration in `src/app/layout.tsx`
- Added logo to homepage, signin, and signup pages
- Updated Next.js config for image optimization

## 📋 To Complete:

### 1. Save Logo Images
Save these files to your `public/` folder:

**Main Logo:** `public/logo.png`
- Use the full DANKPASS logo image you provided
- Recommended size: 200x64px or larger

**Favicon:** `public/favicon.ico` 
- Crop just the large white "D" from the logo
- Save as 32x32px ICO file or PNG
- This will show in browser tabs

### 2. Test the Setup
Once you've saved the logo files:
1. Restart your dev server (`npm run dev`)
2. Check that the logo appears on:
   - Homepage (large logo without text)
   - Sign in page (medium logo with "DankPass" text)
   - Sign up page (medium logo with "DankPass" text)
3. Check browser tab for favicon

## 🎨 Logo Usage:
- **Homepage**: Large logo (64px height) without text
- **Auth pages**: Medium logo (48px height) with "DankPass" text
- **Favicon**: Just the "D" letter for browser tabs

The logo will automatically adapt to different sizes and can be used throughout your app with the `<Logo />` component.
