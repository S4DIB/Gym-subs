import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthContext } from '@/context/AuthContext'

// Mock user data for testing
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

// Mock auth context value
export const mockAuthContext = {
  user: mockUser,
  loading: false,
  logout: jest.fn(),
}

// Custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Test data factories
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
