import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthContext } from '@/context/AuthContext'

/**
 * Mock user data for testing authentication scenarios
 * 
 * Provides a complete mock Firebase User object with all necessary properties
 * and methods for testing authentication-related functionality.
 * 
 * @constant {Object} mockUser
 * @property {string} uid - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} displayName - User's display name
 * @property {string} photoURL - URL to user's profile photo
 * @property {boolean} emailVerified - Whether email is verified
 * @property {boolean} isAnonymous - Whether user is anonymous
 * @property {Object} metadata - User metadata object
 * @property {Array} providerData - Authentication provider data
 * @property {string} refreshToken - User's refresh token
 * @property {string|null} tenantId - Tenant identifier (null for single tenant)
 * @property {Function} delete - Mock delete function
 * @property {Function} getIdToken - Mock get ID token function
 * @property {Function} getIdTokenResult - Mock get ID token result function
 * @property {Function} reload - Mock reload function
 * @property {Function} toJSON - Mock toJSON function
 * @property {string|null} phoneNumber - User's phone number
 * @property {string} providerId - Authentication provider ID
 */
export const mockUser = {
  uid: 'test-uid-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: 'https://example.com/photo.jpg',
  emailVerified: true,
  isAnonymous: false,
  metadata: {},
  providerData: [],
  refreshToken: 'test-refresh-token',
  tenantId: null,
  delete: jest.fn(),
  getIdToken: jest.fn(),
  getIdTokenResult: jest.fn(),
  reload: jest.fn(),
  toJSON: jest.fn(),
  phoneNumber: null,
  providerId: 'google.com',
}

/**
 * Mock authentication context value for testing
 * 
 * Provides a complete mock AuthContext value that can be used
 * to test components that depend on authentication state.
 * 
 * @constant {Object} mockAuthContext
 * @property {Object} user - Mock user object
 * @property {boolean} loading - Authentication loading state (false for testing)
 * @property {Function} logout - Mock logout function
 */
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  logout: jest.fn(),
}

/**
 * Provider wrapper component for testing
 * 
 * Wraps test components with necessary context providers to ensure
 * they have access to required context values during testing.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap
 * @returns {JSX.Element} Wrapped components with providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Custom render function that includes necessary providers
 * 
 * Extends the standard React Testing Library render function to include
 * context providers required by components under test.
 * 
 * @param {ReactElement} ui - React element to render
 * @param {RenderOptions} options - Additional render options
 * @returns {ReturnType<typeof render>} Render result with providers
 * 
 * @example
 * ```tsx
 * import { render } from '@/lib/test-utils'
 * 
 * test('component renders with auth context', () => {
 *   const { getByText } = render(<MyComponent />)
 *   expect(getByText('Welcome, Test User')).toBeInTheDocument()
 * })
 * ```
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything from React Testing Library
export * from '@testing-library/react'

// Override render method with custom implementation
export { customRender as render }

/**
 * Factory function to create mock member data for testing
 * 
 * Generates consistent mock data for gym members that can be used
 * across multiple tests. Accepts overrides to customize specific properties.
 * 
 * @param {Object} [overrides={}] - Properties to override in the mock data
 * @returns {Object} Mock member object with all required properties
 * 
 * @example
 * ```tsx
 * // Use default mock data
 * const member = createMockMember()
 * 
 * // Override specific properties
 * const premiumMember = createMockMember({
 *   membershipType: 'vip',
 *   status: 'active'
 * })
 * 
 * // Override multiple properties
 * const inactiveMember = createMockMember({
 *   firstName: 'Jane',
 *   lastName: 'Smith',
 *   status: 'inactive'
 * })
 * ```
 */
export const createMockMember = (overrides = {}) => ({
  id: 'member-123',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  address: '123 Main St',
  city: 'New York',
  zipCode: '10001',
  membershipType: 'premium' as const,
  status: 'active' as const,
  joinDate: '2024-01-01',
  subscriptionId: 'sub_123',
  emergencyContact: {
    name: 'Jane Doe',
    phone: '+1234567891',
    relationship: 'Spouse'
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    workoutReminders: true,
    classReminders: true
  },
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  createdBy: 'admin-123',
  fullName: 'John Doe',
  ...overrides
})

/**
 * Factory function to create mock workout data for testing
 * 
 * Generates consistent mock data for gym workouts that can be used
 * across multiple tests. Accepts overrides to customize specific properties.
 * 
 * @param {Object} [overrides={}] - Properties to override in the mock data
 * @returns {Object} Mock workout object with all required properties
 * 
 * @example
 * ```tsx
 * // Use default mock data
 * const workout = createMockWorkout()
 * 
 * // Override specific properties
 * const longWorkout = createMockWorkout({
 *   duration: 120,
 *   type: 'cardio'
 * })
 * 
 * // Override exercises
 * const customWorkout = createMockWorkout({
 *   exercises: [
 *     { name: 'Squats', sets: 5, reps: 8, weight: 225 }
 *   ]
 * })
 * ```
 */
export const createMockWorkout = (overrides = {}) => ({
  id: 'workout-123',
  userId: 'user-123',
  date: '2024-01-15',
  duration: 60,
  type: 'strength',
  exercises: [
    {
      name: 'Bench Press',
      sets: 3,
      reps: 10,
      weight: 135,
      notes: 'Felt strong today'
    }
  ],
  notes: 'Great workout session',
  createdAt: new Date('2024-01-15'),
  ...overrides
})

export const createMockClass = (overrides = {}) => ({
  id: 'class-123',
  name: 'Yoga Flow',
  description: 'A relaxing yoga session',
  instructor: 'Sarah Johnson',
  duration: 60,
  maxCapacity: 20,
  currentEnrollment: 15,
  date: '2024-01-20',
  time: '09:00',
  type: 'yoga',
  difficulty: 'beginner',
  location: 'Studio A',
  price: 15,
  isActive: true,
  createdAt: new Date('2024-01-01'),
  ...overrides
})

export const createMockTrainer = (overrides = {}) => ({
  id: 'trainer-123',
  firstName: 'Mike',
  lastName: 'Johnson',
  email: 'mike.johnson@fitlife.com',
  phone: '+1234567890',
  specialties: ['strength', 'cardio', 'yoga'],
  experience: 5,
  certifications: ['NASM', 'ACE'],
  bio: 'Experienced personal trainer with passion for helping others',
  hourlyRate: 50,
  isActive: true,
  avatar: 'https://example.com/avatar.jpg',
  createdAt: new Date('2024-01-01'),
  ...overrides
})

// Mock functions
export const mockConsoleError = () => {
  const originalError = console.error
  const mockError = jest.fn()
  
  beforeAll(() => {
    console.error = mockError
  })
  
  afterAll(() => {
    console.error = originalError
  })
  
  return mockError
}

export const mockConsoleWarn = () => {
  const originalWarn = console.warn
  const mockWarn = jest.fn()
  
  beforeAll(() => {
    console.warn = mockWarn
  })
  
  afterAll(() => {
    console.warn = originalWarn
  })
  
  return mockWarn
}

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}
