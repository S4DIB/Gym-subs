import React from 'react'
import { render, screen } from '@testing-library/react'
import { Button } from '../button'

describe('Button Component', () => {
  it('renders button with default props', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('renders button with custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByRole('button', { name: 'Custom Button' })
    expect(button).toHaveClass('custom-class')
  })

  it('renders button with different variants', () => {
    const { rerender } = render(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-destructive')

    rerender(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button')).toHaveClass('border', 'bg-background')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary')

    rerender(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('hover:bg-accent')

    rerender(<Button variant="link">Link</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-primary', 'underline-offset-4')
  })

  it('renders button with different sizes', () => {
    const { rerender } = render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-8', 'rounded-md')

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('h-10', 'rounded-md')

    rerender(<Button size="icon">Icon</Button>)
    expect(screen.getByRole('button')).toHaveClass('size-9')
  })

  it('renders as child when asChild prop is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    )
    
    const link = screen.getByRole('link', { name: 'Link Button' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/test')
    expect(link).toHaveClass('inline-flex', 'items-center', 'justify-center')
  })

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByRole('button', { name: 'Disabled Button' })
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:pointer-events-none', 'disabled:opacity-50')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref Button</Button>)
    expect(ref.current).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Clickable Button</Button>)
    
    const button = screen.getByRole('button', { name: 'Clickable Button' })
    button.click()
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with icon and text', () => {
    render(
      <Button>
        <span data-testid="icon">🚀</span>
        <span>Launch</span>
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByText('Launch')).toBeInTheDocument()
  })

  it('applies focus styles correctly', () => {
    render(<Button>Focusable Button</Button>)
    const button = screen.getByRole('button', { name: 'Focusable Button' })
    
    expect(button).toHaveClass('outline-none', 'focus-visible:border-ring', 'focus-visible:ring-ring/50')
  })

  it('handles aria attributes', () => {
    render(
      <Button aria-label="Custom label" aria-describedby="description">
        Aria Button
      </Button>
    )
    
    const button = screen.getByRole('button', { name: 'Custom label' })
    expect(button).toHaveAttribute('aria-describedby', 'description')
  })

  it('combines multiple variants and sizes correctly', () => {
    render(
      <Button variant="destructive" size="lg" className="extra-class">
        Combined Props
      </Button>
    )
    
    const button = screen.getByRole('button', { name: 'Combined Props' })
    expect(button).toHaveClass('bg-destructive', 'h-10', 'extra-class')
  })
})
