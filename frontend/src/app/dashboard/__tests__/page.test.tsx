import React from 'react'
import { render, screen } from '@testing-library/react'
import DashboardPage from '../page'
import { mockUser } from '@/lib/test-utils'

// Mock the useAuth hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

const mockUseAuth = require('@/context/AuthContext').useAuth

describe('Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state when auth is loading', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(<DashboardPage />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    // The loading spinner has animate-spin class
    expect(screen.getByText('Loading...').previousElementSibling).toHaveClass('animate-spin')
  })

  it('renders dashboard content when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check welcome message - use a more flexible matcher
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
    expect(screen.getByText(/Ready to crush your fitness goals today?/)).toBeInTheDocument()
    
    // Check quick stats
    expect(screen.getByText('12')).toBeInTheDocument()
    expect(screen.getByText('Workouts This Month')).toBeInTheDocument()
    expect(screen.getByText('48h')).toBeInTheDocument()
    expect(screen.getByText('Total Time Trained')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('Classes Booked')).toBeInTheDocument()
  })

  it('displays user display name when available', () => {
    const userWithDisplayName = {
      ...mockUser,
      displayName: 'John Doe',
    }
    
    mockUseAuth.mockReturnValue({
      user: userWithDisplayName,
      loading: false,
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/Welcome back, John Doe!/)).toBeInTheDocument()
  })

  it('falls back to email username when display name is not available', () => {
    const userWithoutDisplayName = {
      ...mockUser,
      displayName: null,
    }
    
    mockUseAuth.mockReturnValue({
      user: userWithoutDisplayName,
      loading: false,
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/Welcome back, test!/)).toBeInTheDocument()
  })

  it('falls back to generic "Member" when no user info is available', () => {
    const userWithoutInfo = {
      ...mockUser,
      displayName: null,
      email: null,
    }
    
    mockUseAuth.mockReturnValue({
      user: userWithoutInfo,
      loading: false,
    })

    render(<DashboardPage />)
    
    expect(screen.getByText(/Welcome back, Member!/)).toBeInTheDocument()
  })

  it('renders quick action buttons', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check quick action buttons - these are rendered as Link components
    expect(screen.getByText('Log Workout')).toBeInTheDocument()
    expect(screen.getByText('View Workouts')).toBeInTheDocument()
    expect(screen.getByText('Book a Class')).toBeInTheDocument()
    expect(screen.getByText('Find a Trainer')).toBeInTheDocument()
    expect(screen.getByText('Account Settings')).toBeInTheDocument()
  })

  it('renders membership information card', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check membership card
    expect(screen.getByText('Your Membership')).toBeInTheDocument()
    expect(screen.getByText('Current plan and benefits')).toBeInTheDocument()
    expect(screen.getByText('Premium Member')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Next billing:')).toBeInTheDocument()
    expect(screen.getByText('Jan 15, 2025')).toBeInTheDocument()
    expect(screen.getByText('Plan:')).toBeInTheDocument()
    expect(screen.getByText('Premium ($59/month)')).toBeInTheDocument()
    expect(screen.getByText('Manage Billing')).toBeInTheDocument()
  })

  it('renders back to home button', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    const backButton = screen.getByText('Back to Home')
    expect(backButton).toBeInTheDocument()
    // The button is wrapped in a Link, so check the parent anchor
    expect(backButton.closest('a')).toHaveAttribute('href', '/')
  })

  it('applies correct styling classes', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check main container styling - target the root div by looking for the specific class
    const mainContainer = document.querySelector('.min-h-screen.premium-gradient')
    expect(mainContainer).toBeInTheDocument()
    
    // Check header styling - target the div with padding classes
    const header = document.querySelector('.pt-24.px-4.sm\\:px-6.lg\\:px-8')
    expect(header).toBeInTheDocument()
    
    // Check stats grid - target the div with grid classes
    const statsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-6')
    expect(statsContainer).toBeInTheDocument()
  })

  it('renders stats with correct icons and colors', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check trophy icon and color
    const trophyIcon = screen.getByText('12').previousElementSibling
    expect(trophyIcon).toHaveClass('h-8', 'w-8', 'text-yellow-500')
    
    // Check clock icon and color
    const clockIcon = screen.getByText('48h').previousElementSibling
    expect(clockIcon).toHaveClass('h-8', 'w-8', 'text-blue-500')
    
    // Check calendar icon and color
    const calendarIcon = screen.getByText('5').previousElementSibling
    expect(calendarIcon).toHaveClass('h-8', 'w-8', 'text-green-500')
  })

  it('renders quick actions with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check primary button styling - these are rendered as Link components with Button styling
    const logWorkoutButton = screen.getByText('Log Workout')
    expect(logWorkoutButton.closest('a')).toHaveClass('btn-premium')
    
    // Check secondary button styling
    const viewWorkoutsButton = screen.getByText('View Workouts')
    expect(viewWorkoutsButton.closest('a')).toHaveClass('glass-effect')
  })

  it('renders membership badge with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    const membershipBadge = screen.getByText('Premium Member')
    // The badge has many classes, so check for the key ones
    expect(membershipBadge).toHaveClass('glass-effect')
  })

  it('handles empty user gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Should still render the page structure
    expect(screen.getByText(/Welcome back/)).toBeInTheDocument()
  })

  it('maintains responsive design classes', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })

    render(<DashboardPage />)
    
    // Check responsive padding - target the div with padding classes
    const header = document.querySelector('.pt-24.px-4.sm\\:px-6.lg\\:px-8')
    expect(header).toBeInTheDocument()
    
    // Check responsive grid - target the div with grid classes
    const statsContainer = document.querySelector('.grid.grid-cols-1.md\\:grid-cols-3.gap-6')
    expect(statsContainer).toBeInTheDocument()
    
    // Check actions grid - target the div with grid classes
    const actionsContainer = document.querySelector('.grid.grid-cols-1.lg\\:grid-cols-2.gap-8')
    expect(actionsContainer).toBeInTheDocument()
  })
})
