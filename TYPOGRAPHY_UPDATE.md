# DankPass Typography Update

## 🎨 New Font Pairing

### Headings: **Outfit**
- **Style:** Bold, geometric, modern, energetic
- **Vibe:** Active, adventurous, confident
- **Perfect for:** "Earn Free Weed", "Burn Rewards", CTAs
- **Weight:** 700 (Bold)
- **Letter spacing:** Tight (-0.02em) for impact

### Body: **Manrope**
- **Style:** Clean, rounded, friendly, highly readable
- **Vibe:** Approachable, modern, warm
- **Perfect for:** Descriptions, stats, UI text
- **Weight:** 400-600 range
- **Readability:** Excellent on mobile

---

## 🔥 Why This Pairing Works for DankPass

### Active & Outdoorsy Feel
- **Outfit's** geometric shapes = movement, energy, action
- **Manrope's** rounded terminals = approachable, natural, friendly
- Together = "Let's go on an adventure" energy

### Modern & Clean
- Both fonts released in 2020s
- Optimized for screens
- Variable font support
- Excellent at all sizes

### Brand Alignment
- **Outfit** matches "Earn & Burn" energy 🔥
- **Manrope** makes long text comfortable to read
- Perfect for a mobile-first rewards app

---

## 📐 Typography Scale

### Headings (Outfit)
```css
H1: 2.5rem (40px) - Hero headlines
H2: 2rem (32px) - Section titles  
H3: 1.5rem (24px) - Card titles
H4: 1.25rem (20px) - Subsections
```

### Body (Manrope)
```css
Body: 1rem (16px) - Default text
Small: 0.875rem (14px) - Metadata, captions
Tiny: 0.75rem (12px) - Labels, badges
```

---

## 🎯 Visual Examples

### Before (Inter):
```
Earn Free Weed With Every Receipt
Clean, neutral, corporate feel
```

### After (Outfit):
```
Earn Free Weed With Every Receipt
Bold, energetic, confident, active feel
```

### Body Text Comparison:

**Before (Inter):**
```
Upload receipts from dispensaries and restaurants to earn points.
Redeem for free weed, discounts, and exclusive perks.
```
Professional, tech-company vibe

**After (Manrope):**
```
Upload receipts from dispensaries and restaurants to earn points.
Redeem for free weed, discounts, and exclusive perks.
```
Friendly, approachable, warm vibe

---

## 🚀 Where You'll See It

### Homepage
- **"Earn Free Weed"** - Bold Outfit headlines pop
- **"With Every Receipt"** - Clean Outfit subheading
- Body text - Smooth Manrope readability

### Dashboard
- **"Welcome back, Dan!"** - Friendly Outfit
- Stats numbers - Bold Outfit
- Descriptions - Easy-reading Manrope

### Upload Page
- **"Drop your receipt here"** - Active Outfit CTA
- Tips and instructions - Clear Manrope

### Perks Page  
- **"🔥 Burn Rewards"** - Energetic Outfit
- Perk descriptions - Engaging Manrope

### Buttons & CTAs
- All buttons use Outfit (via font-heading)
- Bold, attention-grabbing
- Perfect for "Get Started Free", "Upload Receipt"

---

## 💡 Alternative Font Options

If you want to try something different:

### More Adventurous
- **Headings:** Space Grotesk (techy, bold)
- **Body:** Plus Jakarta Sans (geometric, friendly)

### More Playful
- **Headings:** Poppins (rounded, fun)
- **Body:** DM Sans (neutral, clean)

### More Professional
- **Headings:** Montserrat (classic, strong)
- **Body:** Inter (neutral, readable)

### Outdoorsy/Natural
- **Headings:** Cabin (woodsy, rustic)
- **Body:** Lato (warm, friendly)

---

## 🎨 Using the Fonts in Code

### In Tailwind Classes
```tsx
// Body text (default)
<p className="text-base">Uses Manrope automatically</p>

// Headings (automatic)
<h1>Uses Outfit automatically</h1>

// Force heading font on non-heading elements
<span className="font-heading font-bold">Earn & Burn</span>

// Buttons automatically use heading font
<button className="btn-primary">Get Started</button>
```

### Custom Usage
```tsx
// Force body font
<div className="font-sans">Regular text</div>

// Force heading font  
<div className="font-heading font-bold text-2xl">Big Impact Text</div>
```

---

## ✅ Implementation Complete

**What Changed:**
- ✅ Removed Inter font
- ✅ Added Outfit (headings) + Manrope (body)
- ✅ Configured as CSS variables
- ✅ Auto-applied to all H1-H6 tags
- ✅ Optimized for performance (font-display: swap)

**Impact:**
- 🔥 More energetic, active feel
- 🎯 Better brand alignment with "Earn & Burn"
- 📱 Excellent mobile readability
- ⚡ Modern, clean, professional

**No breaking changes** - just drop-in font replacement!

---

## 🧪 See It In Action

After the dev server restarts:
1. Refresh your browser
2. Notice the **bolder, more geometric headings** (Outfit)
3. Notice the **smoother, rounder body text** (Manrope)
4. Everything feels more active and modern! 🚀

---

**The new typography is live! Check it out and see how it feels.** 🎨

