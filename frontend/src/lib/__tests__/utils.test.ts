import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn function', () => {
    it('should combine class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional')
    })

    it('should handle undefined and null values', () => {
      expect(cn('base', undefined, null, 'valid')).toBe('base valid')
    })

    it('should handle empty strings', () => {
      expect(cn('base', '', 'valid')).toBe('base valid')
    })

    it('should handle arrays', () => {
      expect(cn('base', ['class1', 'class2'])).toBe('base class1 class2')
    })

    it('should handle objects with boolean values', () => {
      expect(cn('base', { 'conditional': true, 'hidden': false })).toBe('base conditional')
    })

    it('should handle mixed input types', () => {
      expect(cn(
        'base',
        'string',
        ['array1', 'array2'],
        { 'obj1': true, 'obj2': false },
        true && 'conditional',
        false && 'hidden'
      )).toBe('base string array1 array2 obj1 conditional')
    })

    it('should return empty string for no inputs', () => {
      expect(cn()).toBe('')
    })

    it('should handle single input', () => {
      expect(cn('single')).toBe('single')
    })
  })
})
