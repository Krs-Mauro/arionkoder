#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const gitHooksDir = path.join(__dirname, '..', '.git', 'hooks');
const preCommitHook = path.join(gitHooksDir, 'pre-push');

// Check if .git directory exists (not in CI environment)
if (!fs.existsSync(path.join(__dirname, '..', '.git'))) {
  process.exit(0);
}

// Ensure hooks directory exists
if (!fs.existsSync(gitHooksDir)) {
  fs.mkdirSync(gitHooksDir, { recursive: true });
}

// Pre-push hook content
const hookContent = `#!/bin/sh

echo "🔍 Running pre-push checks..."
echo ""

# Run type checking
echo "📝 Type checking..."
npm run type-check
if [ $? -ne 0 ]; then
  echo "❌ Type check failed. Push aborted."
  exit 1
fi
echo "✅ Type check passed"
echo ""

# Run linting
echo "🔎 Linting..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ Linting failed. Push aborted."
  exit 1
fi
echo "✅ Linting passed"
echo ""

# Run tests
echo "🧪 Running tests..."
npm run test -- --passWithNoTests
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Push aborted."
  exit 1
fi
echo "✅ Tests passed"
echo ""

# Run build
echo "🏗️  Building..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Push aborted."
  exit 1
fi
echo "✅ Build passed"
echo ""

echo "✨ All checks passed! Proceeding with push..."
exit 0
`;

// Write the hook file
fs.writeFileSync(preCommitHook, hookContent, { mode: 0o755 });

// eslint-disable-next-line no-console
console.log('✅ Git pre-push hook installed successfully!');

