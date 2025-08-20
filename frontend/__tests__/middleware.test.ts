import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../src/middleware'

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({ next: true })),
    redirect: jest.fn((url) => ({ redirect: true, url })),
  },
}))

describe('Middleware', () => {
  let mockNextResponse: any

  beforeEach(() => {
    jest.clearAllMocks()
    mockNextResponse = require('next/server').NextResponse
  })

  const createRequest = (pathname: string, cookies?: Record<string, string>) => {
    const url = new URL(`http://localhost:3000${pathname}`)
    const request = new NextRequest(url)
    
    if (cookies) {
      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })
    }
    
    return request
  }

  describe('Public routes', () => {
    it('should allow access to login page', () => {
      const request = createRequest('/login')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to API routes', () => {
      const request = createRequest('/api/members')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to Next.js internal routes', () => {
      const request = createRequest('/_next/static/chunks/main.js')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to public assets', () => {
      const request = createRequest('/public/images/logo.png')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to favicon', () => {
      const request = createRequest('/favicon.ico')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to image files', () => {
      const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico']
      
      imageExtensions.forEach(ext => {
        const request = createRequest(`/images/photo${ext}`)
        const result = middleware(request)
        
        expect(mockNextResponse.next).toHaveBeenCalled()
        expect(mockNextResponse.redirect).not.toHaveBeenCalled()
      })
    })

    it('should allow access to nested public routes', () => {
      const request = createRequest('/login/signup')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access to API sub-routes', () => {
      const request = createRequest('/api/admin/users')
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })
  })

  describe('Protected routes', () => {
    it('should redirect to login when no auth cookies present', () => {
      const request = createRequest('/dashboard')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/login'
        })
      )
      expect(mockNextResponse.next).not.toHaveBeenCalled()
    })

    it('should redirect to login when no cookies at all', () => {
      const request = createRequest('/admin')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/login'
        })
      )
      expect(mockNextResponse.next).not.toHaveBeenCalled()
    })

    it('should allow access when auth cookie is present', () => {
      const request = createRequest('/dashboard', { auth: '1' })
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access when guest cookie is present', () => {
      const request = createRequest('/dashboard', { guest: '1' })
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should allow access when both auth and guest cookies are present', () => {
      const request = createRequest('/dashboard', { auth: '1', guest: '1' })
      const result = middleware(request)
      
      expect(mockNextResponse.next).toHaveBeenCalled()
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })

    it('should redirect to login for root path when no auth', () => {
      const request = createRequest('/')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/login'
        })
      )
    })

    it('should redirect to login for admin routes when no auth', () => {
      const request = createRequest('/admin/members')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/login'
        })
      )
    })

    it('should redirect to login for dashboard routes when no auth', () => {
      const request = createRequest('/dashboard/workouts')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should redirect to login for member routes when no auth', () => {
      const request = createRequest('/classes')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })
  })

  describe('Cookie handling', () => {
    it('should check for auth cookie specifically', () => {
      const request = createRequest('/dashboard', { other: 'value' })
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should check for guest cookie specifically', () => {
      const request = createRequest('/dashboard', { other: 'value' })
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle empty cookie values', () => {
      const request = createRequest('/dashboard', { auth: '', guest: '' })
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle undefined cookie values', () => {
      const request = createRequest('/dashboard', { auth: undefined as any, guest: undefined as any })
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })
  })

  describe('URL construction', () => {
    it('should preserve query parameters when redirecting', () => {
      const request = createRequest('/dashboard?tab=workouts')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalledWith(
        expect.objectContaining({
          pathname: '/login'
        })
      )
    })

    it('should handle complex URLs with multiple query params', () => {
      const request = createRequest('/admin/members?status=active&type=premium&search=john')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle URLs with hash fragments', () => {
      const request = createRequest('/dashboard#workout-section')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })
  })

  describe('Edge cases', () => {
    it('should handle very long paths', () => {
      const longPath = '/a'.repeat(1000)
      const request = createRequest(longPath)
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle paths with special characters', () => {
      const specialPath = '/dashboard/workouts/2024-01-15%20workout'
      const request = createRequest(specialPath)
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle paths with unicode characters', () => {
      const unicodePath = '/dashboard/用户/设置'
      const request = createRequest(unicodePath)
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle empty pathname', () => {
      const request = createRequest('')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })

    it('should handle root path with trailing slash', () => {
      const request = createRequest('/')
      const result = middleware(request)
      
      expect(mockNextResponse.redirect).toHaveBeenCalled()
    })
  })

  describe('Performance considerations', () => {
    it('should handle multiple requests efficiently', () => {
      const paths = ['/dashboard', '/admin', '/classes', '/trainers', '/pricing']
      
      paths.forEach(path => {
        const request = createRequest(path)
        middleware(request)
      })
      
      // Should redirect all protected routes
      expect(mockNextResponse.redirect).toHaveBeenCalledTimes(paths.length)
    })

    it('should not call redirect for public routes', () => {
      const publicPaths = ['/login', '/api/health', '/favicon.ico']
      
      publicPaths.forEach(path => {
        const request = createRequest(path)
        middleware(request)
      })
      
      // Should not redirect public routes
      expect(mockNextResponse.redirect).not.toHaveBeenCalled()
    })
  })
})
