# Gym Subscription Management System

A comprehensive gym management application built with Next.js, Firebase, and Stripe for handling gym memberships, payments, and user management.

## Features

### Authentication & User Management
- **Firebase Authentication** with Google Sign-In
- **Role-based access control** (Admin, Member, Trainer)
- **Secure session management** with JWT tokens
- **User profile management**

### Membership & Billing
- **Stripe integration** for payment processing
- **Multiple membership tiers** (Basic, Premium, VIP)
- **Subscription management** and billing history
- **Automatic payment processing**

### Fitness Tracking
- **Workout logging** and progress tracking
- **Personal records** management
- **Exercise library** with customizable routines
- **Progress analytics** and statistics

### Member Management
- **Member database** with detailed profiles
- **Emergency contact** information
- **Membership status** tracking
- **Communication preferences**

### Class & Training
- **Class scheduling** and management
- **Trainer profiles** and availability
- **Equipment tracking** and maintenance
- **Booking system** for sessions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Payments**: Stripe
- **Testing**: Jest, React Testing Library
- **Deployment**: Vercel (recommended)

## Prerequisites

Before running this project, ensure you have:

- **Node.js** 18+ installed
- **npm** or **yarn** package manager
- **Firebase** project with Firestore enabled
- **Stripe** account for payment processing
- **Git** for version control

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd gym-subs/frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server-side)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY=your_private_key

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Firebase Setup

1. **Create a Firebase project** at [Firebase Console](https://console.firebase.google.com/)
2. **Enable Authentication** with Google provider
3. **Enable Firestore** database
4. **Create a service account** and download credentials
5. **Set up Firestore security rules**

### 5. Stripe Setup

1. **Create a Stripe account** at [Stripe Dashboard](https://dashboard.stripe.com/)
2. **Get API keys** from the dashboard
3. **Set up webhook endpoints** for payment events
4. **Configure products** for membership tiers

### 6. Database Initialization

```bash
npm run db:init
# or
yarn db:init
```

## Development

### Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Start Production Server

```bash
npm run start
# or
yarn start
```

## Testing

### Run All Tests

```bash
npm test
# or
yarn test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
# or
yarn test:watch
```

### Generate Coverage Report

```bash
npm run test:coverage
# or
yarn test:coverage
```

### Run Tests for CI/CD

```bash
npm run test:ci
# or
yarn test:ci
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/            # Admin dashboard pages
│   ├── api/              # API routes
│   ├── dashboard/        # User dashboard pages
│   ├── login/            # Authentication pages
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── ...               # Feature-specific components
├── context/               # React Context providers
├── lib/                   # Utility functions and configurations
│   ├── firebase/         # Firebase client and admin
│   ├── stripe/           # Stripe integration
│   └── ...
└── __tests__/            # Test files
```

## Available Scripts

- **`npm run dev`** - Start development server
- **`npm run build`** - Build for production
- **`npm run start`** - Start production server
- **`npm run lint`** - Run ESLint
- **`npm test`** - Run test suite
- **`npm run test:watch`** - Run tests in watch mode
- **`npm run test:coverage`** - Generate coverage report
- **`npm run test:ci`** - Run tests for CI/CD

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Members
- `GET /api/members` - Get all members (admin only)
- `POST /api/members` - Create new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Payments
- `POST /api/create-checkout-session` - Create Stripe checkout
- `POST /api/webhooks/stripe` - Stripe webhook handler

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Log new workout
- `PUT /api/workouts/:id` - Update workout

## Security Features

- **JWT token validation** for API routes
- **Role-based access control** (RBAC)
- **Input validation** with Zod schemas
- **CSRF protection** with secure cookies
- **Rate limiting** on API endpoints
- **Secure environment variables**

## Deployment

### Vercel (Recommended)

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The app can be deployed to any platform that supports Node.js:
- **Netlify**
- **Railway**
- **Heroku**
- **AWS Amplify**

## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and add tests
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Code Standards

- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **JSDoc** for documentation
- **Jest** for testing

## 📖 Documentation

- **[API Reference](./docs/API_REFERENCE.md)** - Complete API documentation
- **[Component Library](./docs/COMPONENTS.md)** - UI component documentation
- **[Database Schema](./docs/DATABASE.md)** - Firestore structure
- **[Testing Guide](./docs/TESTING.md)** - Testing strategies and examples
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deployment instructions

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Check environment variables
2. **Stripe payments failing**: Verify webhook configuration
3. **Authentication errors**: Check Firebase Auth setup
4. **Database connection issues**: Verify Firestore rules

### Getting Help

- **Check the documentation** in the `docs/` folder
- **Review existing issues** on GitHub
- **Create a new issue** with detailed information
- **Contact the development team**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Next.js team** for the amazing framework
- **Firebase team** for backend services
- **Stripe team** for payment processing
- **Tailwind CSS** for styling utilities
- **Radix UI** for accessible components

---
