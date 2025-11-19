# Multi-Tenant Beauty Center Booking System

A senior-level front-end technical test showcasing a multi-tenant booking system using Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/Krs-Mauro/arionkoder.git
cd arionkoder
npm install
npm run review
```

Open [http://localhost:3000](http://localhost:3000)

**For reviewers**:

Run `npm run review` to see all quality checks (type-check → lint → tests → build) then launch production build. Stop dev server first if running.

## 🐳 Why No Docker?

This is a simple Next.js app with no external services (database, cache, etc.). Docker would add unnecessary complexity for reviewers. Standard Node.js setup is faster and more accessible.

## 🔧 Troubleshooting

**Port in use**: `npm run dev -- -p 3001`  
**Node version**: Requires Node.js 18+ (`nvm install 18 && nvm use 18`)  
**Install fails**: `npm cache clean --force && rm -rf node_modules package-lock.json && npm install`  
**Build fails**: `rm -rf .next && npm run build`  
**Tests fail**: `npx jest --clearCache && npm test`  
**Hooks not working**: `node scripts/install-hooks.js`

## 🔒 Pre-Push Hook

**Auto-installed** on `npm install` via the `prepare` script. Runs on `git push`: type-check → lint → tests → build. Bypass with `git push --no-verify` (not recommended).

## 🏗️ Architecture

### Tech Stack

- **Next.js 16** with App Router
- **React 19** with functional components and hooks
- **TypeScript 5** with strictest compiler settings
- **Tailwind CSS 4** for styling
- **Jest + React Testing Library** for testing

### Key Features

1. **Multi-Tenant System**: Three beauty centers with individual landing pages
2. **Booking Management**: Global bookings page + per-center views
3. **LocalStorage Persistence**: Client-side booking storage
4. **Mock API**: Next.js API routes with 1.5s delay
5. **Error Boundaries**: Global error handling with test trigger
6. **Strict Type Safety**: No `any`, no `unknown`, explicit return types
7. **Business Hours Validation**: Bookings restricted to 5 AM - 9 PM
8. **Custom Validation**: No external form libraries
9. **Comprehensive Testing**: Type guards tested with Jest

### Project Structure

```
├── app/                    # Next.js App Router
│   ├── [center]/          # Dynamic center pages
│   ├── api/               # API routes
│   ├── bookings/          # Global bookings page
│   └── layout.tsx         # Root layout with ErrorBoundary
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and business logic
│   ├── __tests__/         # Test files
│   ├── validation.ts      # Form validation
│   ├── type-guards.ts     # Runtime type checking
│   └── storage.ts         # LocalStorage utilities
├── types/                 # TypeScript definitions
└── scripts/               # Build and setup scripts
```

## 🎯 Design Decisions

**File Size**: Target ~100 lines per file for maintainability  
**TypeScript**: Strictest settings (`strict`, `noUnusedLocals`, `noImplicitReturns`, etc.)  
**Linting**: No `any`, no `console.log`, explicit return types required  
**Validation**: Custom hooks to minimize dependencies  
**Price Storage**: Stored in cents to avoid floating-point issues  
**Business Hours**: 5:00 AM to 9:00 PM validation

## �� Testing

Tests located in `__tests__` directories next to source code.

**Run tests**:

```bash
npm test                  # Single run
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage
```

**Coverage**: Components, hooks, pages, utilities, and business logic. API routes excluded (complex Web API mocking not needed - business logic tested separately).

**Test utilities**: `__tests__/test-utils.tsx` provides custom render with provider wrappers.

## 🐛 Error Boundary

Test trigger button on each center page. In dev mode, close Next.js error overlay to see the Error Boundary UI.

## 📱 Features

**Home**: Lists 3 beauty centers, "View All Bookings" button  
**Center Pages**: Services list, booking form, per-center bookings, error boundary test  
**Bookings Page**: All bookings across centers with formatted dates/times  
**Booking Flow**: Form validation → API submission → Confirmation → LocalStorage persistence

## 🔍 Code Quality

✅ Most files under 100 lines
✅ No `any` or `unknown` types
✅ No `console.log` (only `warn`/`error`)
✅ Explicit return types
✅ Readonly types for immutability
✅ Low coupling, high cohesion
✅ Comprehensive error handling
✅ Accessible UI (ARIA labels, semantic HTML)
✅ Passing tests
✅ Pre-push hooks enforce quality

## 🤖 AI-Assisted Development

This project was developed with **AI assistance**. AI was used for:

- Test suite creation (312 tests across 26 files)
- Documentation and code reviews
