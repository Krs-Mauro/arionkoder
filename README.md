# Multi-Tenant Beauty Center Booking System

A senior-level front-end technical test implementation showcasing a multi-tenant booking system for beauty centers using Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Krs-Mauro/arionkoder.git
   cd arionkoder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install Git pre-push hooks** (IMPORTANT)

   ```bash
   npm run install-hooks
   ```

   This sets up automatic validation before pushing code. The pre-push hook will:

   - Run TypeScript type checking
   - Run ESLint
   - Run all tests
   - Run production build

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run type-check` - Run TypeScript compiler check
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run validate` - Run type-check, lint, and tests
- `npm run prepare` - Install Git pre-push hooks (runs automatically on npm install)

## 🔒 Git Pre-Push Hook

The pre-push hook is **automatically installed** when you run `npm install` (via the `prepare` script).

### How It Works

When you run `git push`, the hook will automatically:

1. ✅ Run TypeScript type checking
2. ✅ Run ESLint validation
3. ✅ Run all tests (27 tests for type guards)
4. ✅ Run production build

If any step fails, the push will be **blocked** until you fix the issues.

### Manual Hook Installation

If the hook isn't working, you can manually install it:

```bash
node scripts/install-hooks.js
```

### Bypassing the Hook (Not Recommended)

In emergencies only:

```bash
git push --no-verify
```

## 🏗️ Architecture & Technical Decisions

### Tech Stack

- **Next.js 16** with App Router
- **React 19** with functional components and hooks
- **TypeScript 5** with strictest compiler settings
- **Tailwind CSS 4** for styling
- **Jest + React Testing Library** for testing
- **ESLint 9** with custom strict rules

### Key Features

1. **Multi-Tenant System**: Three beauty centers, each with their own landing page
2. **Booking Flow**: Service selection → Form validation → Confirmation
3. **Bookings Management**: Global bookings page + per-center bookings view
4. **LocalStorage Persistence**: Bookings saved client-side
5. **Mock API**: Next.js API routes with artificial 1.5s delay
6. **Error Boundaries**: Global error handling with test trigger
7. **Strict Type Safety**: No `any`, no `unknown`, explicit return types
8. **Business Hours Validation**: Bookings only allowed 5 AM - 9 PM
9. **Custom Validation Hooks**: No external form libraries
10. **Comprehensive Testing**: Tests for type guards with Jest + React Testing Library

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── [center]/          # Dynamic center pages
│   ├── api/               # API routes
│   ├── bookings/          # Global bookings page
│   ├── layout.tsx         # Root layout with ErrorBoundary
│   └── page.tsx           # Home page
├── components/            # Reusable UI components
│   ├── CenterPageContent.tsx    # Center page layout
│   ├── CenterHeader.tsx         # Center header component
│   ├── CenterServices.tsx       # Services grid
│   ├── CenterBookings.tsx       # Per-center bookings view
│   ├── CenterBookingModal.tsx   # Booking modal
│   ├── BookingForm.tsx          # Booking form with validation
│   ├── BookingConfirmation.tsx  # Booking success confirmation
│   ├── BookingsList.tsx         # Reusable bookings table
│   └── ...                      # Other UI components
├── hooks/                 # Custom React hooks
│   ├── useBooking.ts      # Booking state management
│   ├── useCenter.ts       # Center data fetching
│   └── useFormValidation.ts # Form validation logic
├── lib/                   # Utilities and business logic
│   ├── __tests__/         # Test files
│   │   └── type-guards.test.ts  # Type guard tests
│   ├── validation.ts      # Form validation with business hours
│   ├── type-guards.ts     # Runtime type checking
│   ├── storage.ts         # LocalStorage utilities
│   ├── errors.ts          # Error handling
│   └── mock-data.ts       # Mock data for 3 centers
├── types/                 # TypeScript type definitions
└── scripts/               # Build and setup scripts
```

## 🎯 Design Decisions

### 1. File Size Constraint (~100 lines target)

Keep files under 100 lines for maintainability and readability.

### 2. Strict TypeScript Configuration

- `strict: true`
- `noUnusedLocals: true`
- `noImplicitReturns: true`
- `noUncheckedIndexedAccess: true`
- `exactOptionalPropertyTypes: true`

### 3. Strict Linting Rules

- ❌ No `any` type allowed
- ❌ No `console.log` (only `console.warn` and `console.error`)
- ✅ Explicit function return types required
- ✅ Strict boolean expressions

### 4. Custom Validation

Built custom validation hooks instead of using libraries like `react-hook-form` to minimize dependencies and demonstrate senior-level implementation skills.

### 5. Price Storage

Prices stored in cents (integers) to avoid floating-point arithmetic issues.

### 6. Business Hours Validation

Time selection validated to be between 5:00 AM and 9:00 PM (service hours).

## 🧪 Testing Strategy

### Test Location

All tests are located in `__tests__` directories next to the code they test:

```
lib/
├── __tests__/
│   └── type-guards.test.ts
├── type-guards.ts
├── validation.ts
└── ...
```

### Run Tests

```bash
npm test                  # Single run (used in pre-push hook)
npm run test:watch        # Watch mode for development
npm run test:coverage     # With coverage report
```

### Testing Philosophy

Focus on **critical runtime safety**:

- ✅ Type guards (runtime type checking from LocalStorage/API)
- 🔜 Validation utilities (business rules)
- 🔜 Storage utilities (data persistence)
- 🔜 Component rendering (UI correctness)
- 🔜 Booking flow integration (end-to-end)

## 🐛 Error Boundary Testing

The app includes an Error Boundary with a test trigger button on each center page.

**Note**: In Next.js development mode, errors are caught by the framework's error overlay first. To see the Error Boundary UI:

1. Click "Trigger Test Error" button
2. Close the Next.js error overlay (X button)
3. The Error Boundary fallback UI will be visible

In production builds, the Error Boundary works as expected without the overlay.

## 📱 Features

### Home Page

- Lists all 3 beauty centers with logos and descriptions
- "View All Bookings" button to see all bookings across all centers
- Click any center card to view services

### Center Pages

- Display center information and logo
- List all available services with prices and duration
- "Book Now" button for each service
- **Per-center bookings section** showing bookings for that specific center
- Back navigation to home page
- Link to view all bookings
- Error boundary test trigger (for reviewers)

### Global Bookings Page (`/bookings`)

- View **all bookings** across all centers
- Displays: Client name/email, Center, Service, Date/Time, Booked On
- Formatted dates and times (12-hour format)
- Empty state when no bookings exist
- Back navigation to home page

### Booking Flow

1. Click "Book Now" on any service
2. Fill out the booking form:
   - Full Name (min 2 characters)
   - Email Address (valid format)
   - Date (future dates only)
   - Time (5 AM - 9 PM only)
3. Real-time validation on blur
4. Submit to create booking
5. View confirmation with booking details
6. Booking saved to LocalStorage

## 🔍 Code Quality

- ✅ Most files under 100 lines (see "File Size Constraint" section for exceptions)
- ✅ No `any` or `unknown` types
- ✅ No `console.log` statements (only `console.warn` and `console.error`)
- ✅ Explicit return types on all functions
- ✅ Readonly types for immutability
- ✅ Low coupling, high cohesion
- ✅ Comprehensive error handling
- ✅ Accessible UI (ARIA labels, semantic HTML)
- ✅ 27 passing tests for type guards
- ✅ Pre-push hooks enforce quality (type-check, lint, test, build)
