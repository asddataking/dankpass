# 🚀 DankPass Landing Page

## Overview

A beautiful, modern landing page with waitlist functionality for DankPass. The page includes:

- **Hero section** with compelling copy and call-to-action
- **Waitlist signup form** with name and email fields
- **Perks showcase** highlighting the benefits of DankPass
- **How it works** section with a simple 3-step process
- **Social proof** with stats and testimonials
- **Fully responsive** design with your brand styling

## 🌐 Access the Page

Visit: **`/landing`** on your app

Example: `http://localhost:3000/landing` or `https://dankpass.vercel.app/landing`

## 💾 Database Setup

### Neon Database Created

- **Project ID:** `floral-cell-89377091`
- **Database:** `neondb`
- **Table:** `waitlist`

### Table Schema

```sql
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Environment Variables

Add this to your `.env.local` file (if not already there):

```bash
DATABASE_URL="postgresql://neondb_owner:npg_wBrYDRgQ1en7@ep-misty-dew-ae0yf03m-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEON_PROJECT_ID="floral-cell-89377091"
```

## 📡 API Endpoints

### POST /api/waitlist

Adds a new user to the waitlist.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Successfully joined the waitlist!"
}
```

**Response (Error - Duplicate Email):**
```json
{
  "error": "This email is already on the waitlist"
}
```

### GET /api/waitlist

Retrieves all waitlist entries (for admin use).

**Response:**
```json
{
  "success": true,
  "count": 42,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-15T10:30:00Z"
    }
    // ... more entries
  ]
}
```

## 🎨 Features

### Design Elements

- ✅ Soft gradient backgrounds matching your brand
- ✅ Smooth animations using Framer Motion
- ✅ Hover effects on cards
- ✅ Form validation
- ✅ Success/error states
- ✅ Responsive layout (mobile, tablet, desktop)

### Form Features

- ✅ Name validation (required)
- ✅ Email validation (format check)
- ✅ Duplicate email prevention
- ✅ Loading states during submission
- ✅ Success/error messages
- ✅ Form reset after successful submission

### Sections Included

1. **Hero** - Main headline with CTA and stats
2. **Social Proof** - User avatars and star rating
3. **Signup Form** - Beautiful card with form fields
4. **Perks** - 4 key benefits of DankPass
5. **How It Works** - 3-step process
6. **Final CTA** - Bottom call-to-action
7. **Footer** - Logo and copyright

## 🔍 Viewing Waitlist Data

You can view all waitlist signups by:

1. **Via API:** Visit `/api/waitlist` in your browser
2. **Via Neon Console:** Log into Neon and run SQL queries
3. **Via Code:** Use the Neon MCP tools to query the database

## 🚀 Next Steps

1. **Add the DATABASE_URL** to your `.env.local` file
2. **Test the form** at `/landing`
3. **Customize the copy** in `src/app/landing/page.tsx` if needed
4. **Set up email notifications** (optional) when users join
5. **Create an admin dashboard** to view/export waitlist entries

## 📝 Customization

To customize the landing page:

- Edit `src/app/landing/page.tsx`
- Update the perks, stats, and copy to match your messaging
- All styling uses your existing brand tokens
- Form connects automatically to the database

## 🎯 Deploy

The landing page is ready to deploy! Just push to your repo and Vercel will automatically build and deploy.

Make sure to add the `DATABASE_URL` environment variable in your Vercel project settings.

