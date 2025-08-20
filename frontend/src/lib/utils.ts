import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple CSS class names using clsx and tailwind-merge
 * 
 * This utility function:
 * - Combines multiple class names into a single string
 * - Resolves conditional classes using clsx
 * - Deduplicates and optimizes Tailwind CSS classes using tailwind-merge
 * - Handles undefined/null values gracefully
 * 
 * @param {...ClassValue[]} inputs - CSS class names to combine
 * @returns {string} Merged and optimized CSS class string
 * 
 * @example
 * ```tsx
 * // Basic usage
 * cn('bg-blue-500', 'text-white', 'px-4 py-2')
 * // Returns: "bg-blue-500 text-white px-4 py-2"
 * 
 * // With conditional classes
 * cn(
 *   'base-class',
 *   isActive && 'bg-green-500',
 *   isDisabled && 'opacity-50'
 * )
 * 
 * // With dynamic classes
 * cn(
 *   'button',
 *   variant === 'primary' ? 'bg-blue-500' : 'bg-gray-500',
 *   className // Additional classes from props
 * )
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
