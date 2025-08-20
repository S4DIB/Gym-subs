import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import AdminLayout from '../layout'
import { mockUser } from '@/lib/test-utils'

// Mock the useAuth hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock the isAdmin function
jest.mock('@/lib/admin', () => ({
  isAdmin: jest.fn(),
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

const mockUseAuth = require('@/context/AuthContext').useAuth
const mockIsAdmin = require('@/lib/admin').isAdmin

describe('Admin Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders loading state initially', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    })

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    // The loading spinner has animate-spin class
    expect(screen.getByText('Loading...').previousElementSibling).toHaveClass('animate-spin')
  })

  it('redirects non-admin users to dashboard', async () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(false)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('redirects unauthenticated users to dashboard', async () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    })

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/dashboard')
    })
  })

  it('renders admin interface for admin users', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Check admin header
    expect(screen.getByText('FitLife Admin')).toBeInTheDocument()
    expect(screen.getByText('ADMIN')).toBeInTheDocument()
    
    // Check navigation items
    expect(screen.getByText('Overview')).toBeInTheDocument()
    expect(screen.getByText('Members')).toBeInTheDocument()
    expect(screen.getByText('Trainers')).toBeInTheDocument()
    expect(screen.getByText('Classes')).toBeInTheDocument()
    expect(screen.getByText('Equipment')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    
    // Check user email
    expect(screen.getByText(mockUser.email!)).toBeInTheDocument()
    
    // Check main content
    expect(screen.getByText('Admin Content')).toBeInTheDocument()
  })

  it('renders access denied for non-admin users', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(false)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    expect(screen.getByText('Access Denied')).toBeInTheDocument()
    expect(screen.getByText("You don't have admin permissions to access this area.")).toBeInTheDocument()
    expect(screen.getByText('Return to Dashboard')).toBeInTheDocument()
  })

  it('renders admin header with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Target the header container div that has the border styling
    const header = document.querySelector('.border-b.border-border\\/50.bg-black\\/20.backdrop-blur-sm')
    expect(header).toBeInTheDocument()
  })

  it('renders admin badge with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    const adminBadge = screen.getByText('ADMIN')
    expect(adminBadge).toHaveClass('bg-red-600')
    // Check that the badge text is rendered and has the red background
    expect(adminBadge).toBeInTheDocument()
    expect(adminBadge).toHaveClass('bg-red-600')
  })

  it('renders navigation with correct structure', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Check that navigation items are rendered as Link components (Button with asChild)
    const overviewLink = screen.getByText('Overview')
    expect(overviewLink.closest('a')).toBeInTheDocument()
    
    const membersLink = screen.getByText('Members')
    expect(membersLink.closest('a')).toBeInTheDocument()
  })

  it('renders member view button with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    const memberViewButton = screen.getByText('Member View')
    expect(memberViewButton.closest('a')).toHaveClass('glass-effect')
    expect(memberViewButton.closest('a')).toHaveAttribute('href', '/dashboard')
  })

  it('renders sidebar with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    const sidebar = screen.getByText('Overview').closest('div')?.parentElement
    expect(sidebar?.parentElement).toHaveClass('w-64', 'flex-shrink-0')
  })

  it('renders main content area with correct styling', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    const mainContent = screen.getByText('Admin Content').closest('div')
    expect(mainContent?.parentElement).toHaveClass('flex-1')
  })

  it('applies correct layout structure', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Target the container div that has the max-width and padding classes
    const container = document.querySelector('.max-w-7xl.mx-auto.px-4.sm\\:px-6.lg\\:px-8')
    expect(container).toBeInTheDocument()
    
    // Target the layout container with flex and gap classes
    const layoutContainer = document.querySelector('.flex.gap-8')
    expect(layoutContainer).toBeInTheDocument()
  })

  it('handles navigation item links correctly', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Check that navigation items have correct href attributes
    const overviewLink = screen.getByText('Overview').closest('a')
    expect(overviewLink).toHaveAttribute('href', '/admin')
    
    const membersLink = screen.getByText('Members').closest('a')
    expect(membersLink).toHaveAttribute('href', '/admin/members')
    
    const trainersLink = screen.getByText('Trainers').closest('a')
    expect(trainersLink).toHaveAttribute('href', '/admin/trainers')
    
    const classesLink = screen.getByText('Classes').closest('a')
    expect(classesLink).toHaveAttribute('href', '/admin/classes')
    
    const equipmentLink = screen.getByText('Equipment').closest('a')
    expect(equipmentLink).toHaveAttribute('href', '/admin/equipment')
    
    const settingsLink = screen.getByText('Settings').closest('a')
    expect(settingsLink).toHaveAttribute('href', '/admin/settings')
  })

  it('applies glass effect styling to navigation items', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Navigation items are rendered as Link components with Button styling
    const navigationItems = screen.getAllByRole('link')
    navigationItems.forEach(item => {
      expect(item).toHaveClass('glass-effect')
    })
  })

  it('maintains responsive design', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    // Target the container div that has the padding classes
    const container = screen.getByText('FitLife Admin').closest('div')?.parentElement?.parentElement
    expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
  })

  it('renders shield icon in access denied state', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(false)

    render(
      <AdminLayout>
        <div>Admin Content</div>
      </AdminLayout>
    )

    const shieldIcon = screen.getByText('Access Denied').previousElementSibling
    expect(shieldIcon).toHaveClass('h-16', 'w-16', 'text-red-500')
  })

  it('handles empty children gracefully', () => {
    mockUseAuth.mockReturnValue({
      user: mockUser,
      loading: false,
    })
    mockIsAdmin.mockReturnValue(true)

    render(<AdminLayout>{null}</AdminLayout>)

    // Should still render the admin interface structure
    expect(screen.getByText('FitLife Admin')).toBeInTheDocument()
    expect(screen.getByText('Overview')).toBeInTheDocument()
  })
})
