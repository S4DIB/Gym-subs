import { isAdmin } from '@/lib/admin'

describe('admin utilities', () => {
  describe('isAdmin function', () => {
    const adminEmails = [
      'shahsadib25@gmail.com',
      'admin@fitlife.com',
      'ADMIN@FITLIFE.COM', // Test case sensitivity
    ]

    const nonAdminEmails = [
      'user@example.com',
      'member@fitlife.com',
      'trainer@fitlife.com',
      'test@test.com',
      '',
      null,
      undefined,
    ]

    it('should return true for admin emails', () => {
      adminEmails.forEach(email => {
        const mockUser = { email } as any
        expect(isAdmin(mockUser)).toBe(true)
      })
    })

    it('should return false for non-admin emails', () => {
      nonAdminEmails.forEach(email => {
        const mockUser = { email } as any
        expect(isAdmin(mockUser)).toBe(false)
      })
    })

    it('should handle user without email property', () => {
      const mockUser = {} as any
      expect(isAdmin(mockUser)).toBe(false)
    })

    it('should handle null user', () => {
      expect(isAdmin(null)).toBe(false)
    })

    it('should handle undefined user', () => {
      expect(isAdmin(undefined)).toBe(false)
    })

    it('should be case insensitive', () => {
      const mockUser = { email: 'SHAHSADIB25@GMAIL.COM' } as any
      expect(isAdmin(mockUser)).toBe(true)
    })

    it('should handle mixed case emails', () => {
      const mockUser = { email: 'ShahSadib25@Gmail.com' } as any
      expect(isAdmin(mockUser)).toBe(true)
    })
  })
})
