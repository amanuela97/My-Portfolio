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
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_CLIENT_ID=your_client_id

# Application Config
NEXT_PUBLIC_ALLOWED_EMAILS=email1@example.com,email2@example.com
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility functions and configs
│   └── login/             # Login page
├── public/                # Static assets
└── types/                 # TypeScript type definitions
```

## Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy to your preferred platform (Vercel recommended):

```bash
vercel deploy
```

## Security Features

- Protected admin routes with middleware
- Session-based authentication
- Email allowlist for admin access
- Secure cookie handling
- Environment variable protection
- Firebase security rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
