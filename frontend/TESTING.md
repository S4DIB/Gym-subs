# Testing Guide for Gym Subscription App

This document provides comprehensive information about the testing setup and how to run tests for the Gym Subscription application.

## 🧪 Testing Stack

- **Jest** - JavaScript testing framework
- **React Testing Library** - React component testing utilities
- **@testing-library/jest-dom** - Custom Jest matchers for DOM testing
- **@testing-library/user-event** - User interaction simulation
- **jsdom** - DOM environment for Node.js testing

## 📦 Installation

The testing dependencies are already included in `package.json`. If you need to install them manually:

```bash
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event jest jest-environment-jsdom @types/jest
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (recommended for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test File Patterns

Tests are automatically discovered based on these patterns:
- `**/__tests__/**/*.{js,jsx,ts,tsx}`
- `**/*.{test,spec}.{js,jsx,ts,tsx}`

## 🏗️ Test Structure

```
src/
├── __tests__/                    # Test directories
│   ├── components/              # Component tests
│   ├── lib/                     # Utility function tests
│   ├── context/                 # Context tests
│   └── app/                     # Page and API route tests
├── lib/
│   └── test-utils.tsx          # Test utilities and helpers
├── jest.config.js               # Jest configuration
└── jest.setup.js                # Jest setup and mocks
```

## 🧩 Test Utilities

### Custom Render Function

The `test-utils.tsx` file provides a custom render function that automatically wraps components with necessary providers:

```tsx
import { render, screen } from '@/lib/test-utils'

test('renders component', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### Mock Data Factories

```tsx
import { createMockMember, createMockWorkout } from '@/lib/test-utils'

const member = createMockMember({ firstName: 'John' })
const workout = createMockWorkout({ duration: 90 })
```

### Mock Functions

```tsx
import { mockConsoleError, mockConsoleWarn } from '@/lib/test-utils'

const mockError = mockConsoleError()
// Test code that logs errors
expect(mockError).toHaveBeenCalled()
```

## 🔧 Configuration

### Jest Configuration (`jest.config.js`)

- **Environment**: jsdom for DOM testing
- **Path Mapping**: `@/*` maps to `./src/*`
- **Coverage Thresholds**: 70% for branches, functions, lines, and statements
- **Setup**: Automatically loads `jest.setup.js`

### Jest Setup (`jest.setup.js`)

- **DOM Testing**: Imports `@testing-library/jest-dom`
- **Mock Setup**: Mocks Next.js router, Firebase, Stripe
- **Environment Variables**: Sets test environment variables
- **Global Mocks**: ResizeObserver, matchMedia

## 📱 Component Testing

### Basic Component Test

```tsx
import { render, screen } from '@/lib/test-utils'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

### Testing with Context

```tsx
import { render, screen } from '@/lib/test-utils'
import { DashboardPage } from '@/app/dashboard/page'

// Mock the context hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

test('renders dashboard for authenticated user', () => {
  const mockUseAuth = require('@/context/AuthContext').useAuth
  mockUseAuth.mockReturnValue({
    user: { email: 'test@example.com' },
    loading: false,
  })
  
  render(<DashboardPage />)
  expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
})
```

## 🌐 API Route Testing

### Testing API Endpoints

```tsx
import { NextRequest } from 'next/server'
import { GET } from '@/app/api/members/route'

describe('Members API', () => {
  it('returns 401 without authorization', async () => {
    const request = new NextRequest('http://localhost:3000/api/members')
    const response = await GET(request)
    expect(response.status).toBe(401)
  })
})
```

### Mocking External Dependencies

```tsx
// Mock Firebase Admin
jest.mock('@/lib/firebase/admin', () => ({
  adminAuth: {
    verifyIdToken: jest.fn(),
  },
  adminDb: {
    collection: jest.fn(),
  },
}))
```

## 🔐 Authentication Testing

### Testing Protected Routes

```tsx
test('redirects non-admin users', async () => {
  mockIsAdmin.mockReturnValue(false)
  render(<AdminLayout />)
  
  await waitFor(() => {
    expect(mockPush).toHaveBeenCalledWith('/dashboard')
  })
})
```

### Testing Auth Context

```tsx
test('provides user data when authenticated', async () => {
  mockOnAuthStateChanged.mockImplementation((auth, callback) => {
    callback(mockUser)
    return jest.fn()
  })
  
  render(<AuthProvider><TestComponent /></AuthProvider>)
  
  await waitFor(() => {
    expect(screen.getByText(`User: ${mockUser.email}`)).toBeInTheDocument()
  })
})
```

## 🎨 UI Component Testing

### Testing Styling

```tsx
test('applies correct CSS classes', () => {
  render(<Button variant="destructive">Delete</Button>)
  expect(screen.getByRole('button')).toHaveClass('bg-destructive')
})
```

### Testing Accessibility

```tsx
test('maintains proper heading hierarchy', () => {
  render(<CardTitle>Title</CardTitle>)
  expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
})
```

### Testing User Interactions

```tsx
import userEvent from '@testing-library/user-event'

test('handles click events', async () => {
  const user = userEvent.setup()
  const handleClick = jest.fn()
  
  render(<Button onClick={handleClick}>Click me</Button>)
  await user.click(screen.getByRole('button'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

## 📊 Coverage Reports

### Running Coverage

```bash
npm run test:coverage
```

This generates a coverage report showing:
- **Statements**: 70% threshold
- **Branches**: 70% threshold  
- **Functions**: 70% threshold
- **Lines**: 70% threshold

### Coverage Configuration

Coverage is collected from:
- `src/**/*.{js,jsx,ts,tsx}`
- Excludes: `.d.ts`, `.stories`, `.test`, `.spec`, `index` files

## 🚨 Common Issues & Solutions

### Mock Not Working

```tsx
// Ensure mocks are defined before imports
jest.mock('@/lib/firebase/admin', () => ({
  adminAuth: { verifyIdToken: jest.fn() },
}))

import { GET } from '@/app/api/members/route'
```

### Async Test Failures

```tsx
// Use waitFor for async operations
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})
```

### Context Provider Issues

```tsx
// Use the custom render function from test-utils
import { render } from '@/lib/test-utils'

render(<Component />) // Automatically wrapped with providers
```

## 🧪 Test Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe` blocks
- Keep tests focused and atomic

### 2. Mocking Strategy
- Mock external dependencies (Firebase, Stripe)
- Mock Next.js specific features (router, middleware)
- Use realistic mock data

### 3. Assertions
- Test user behavior, not implementation details
- Use semantic queries (`getByRole`, `getByLabelText`)
- Verify accessibility features

### 4. Test Data
- Use factory functions for consistent test data
- Avoid hardcoded values in tests
- Make tests independent and repeatable

## 🔄 Continuous Integration

### GitHub Actions

The `test:ci` script is designed for CI environments:
- Runs without watch mode
- Generates coverage reports
- Exits with appropriate status codes

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests:
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test:ci"
    }
  }
}
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Next.js Testing](https://nextjs.org/docs/testing)

## 🤝 Contributing

When adding new tests:
1. Follow the existing test structure
2. Use the provided test utilities
3. Maintain coverage thresholds
4. Test both success and error cases
5. Include accessibility testing where applicable

---

Happy Testing! 🎯
