# Portfolio Website

A modern, dynamic portfolio website built with Next.js 14, Firebase, and Tailwind CSS. Features a clean, responsive design with an admin dashboard for easy content management.

## Features

- 🔐 **Secure Authentication**

  - Google Sign-in with email allowlist
  - Protected admin routes
  - Session management with cookies

- 📝 **Content Management**

  - Hero section with profile image
  - About section with rich text and inline links
  - Contact information with social links
  - Experience timeline
  - Project showcase
  - Writing/Blog section
  - Resume upload and management

- 💅 **Design & UI**

  - Responsive design with Tailwind CSS
  - Modern purple theme
  - Clean and professional layout
  - Image optimization with Next.js
  - Loading states and error handling
  - Toast notifications

- 🔧 **Technical Features**
  - Server-side rendering with Next.js 14
  - Firebase Authentication
  - Firestore database
  - Firebase Storage for images
  - TypeScript for type safety
  - Environment variable configuration
  - Error boundary implementation

## Prerequisites

- Node.js 18.17 or later
- Firebase project with:
  - Authentication (Google provider enabled)
  - Firestore Database
  - Storage
  - Admin SDK credentials

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Client Config (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Required)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_ID=your_client_id
# IMPORTANT: For FIREBASE_PRIVATE_KEY
# 1. Copy the entire private key from your service account JSON INCLUDING the quotes
# 2. The value should look exactly like this (with quotes and \n):
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSj\n...rest of your key...\n-----END PRIVATE KEY-----\n"

# Application Config (Required)
NEXT_PUBLIC_ALLOWED_EMAILS=email1@example.com,email2@example.com
```

### Getting Firebase Configuration Values

1. **Client Config Values:**

   - Go to Firebase Console > Project Settings > General
   - Scroll down to "Your apps" section
   - Click the web app icon (</>)
   - Register app if you haven't already
   - Copy the configuration values from the provided config object

2. **Admin SDK Values:**

   - Go to Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - This will download a JSON file containing all admin SDK credentials
   - Copy values from this JSON file to your environment variables

3. **Vercel Deployment:**
   - Add ALL of the above environment variables to your Vercel project settings
   - Make sure to copy the FIREBASE_PRIVATE_KEY exactly as shown above
   - Double-check that NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN matches your Firebase app domain

## Installation

1. Clone the repository:

```

```
