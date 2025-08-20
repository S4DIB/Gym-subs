import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with default props', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col', 'gap-6', 'rounded-xl', 'border', 'py-6', 'shadow-sm')
    })

    it('renders card with custom className', () => {
      render(<Card className="custom-card">Custom Card</Card>)
      const card = screen.getByText('Custom Card')
      expect(card).toHaveClass('custom-card')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Card ref={ref}>Ref Card</Card>)
      expect(ref.current).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<Card>Card content</Card>)
      const card = screen.getByText('Card content')
      expect(card).toHaveAttribute('data-slot', 'card')
    })
  })

  describe('CardHeader', () => {
    it('renders card header with default props', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
      expect(header).toHaveClass('@container/card-header', 'grid', 'auto-rows-min', 'grid-rows-[auto_auto]', 'items-start', 'gap-1.5', 'px-6')
    })

    it('renders card header with custom className', () => {
      render(<CardHeader className="custom-header">Custom Header</CardHeader>)
      const header = screen.getByText('Custom Header')
      expect(header).toHaveClass('custom-header')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardHeader ref={ref}>Ref Header</CardHeader>)
      expect(ref.current).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<CardHeader>Header content</CardHeader>)
      const header = screen.getByText('Header content')
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })
  })

  describe('CardTitle', () => {
    it('renders card title with default props', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('leading-none', 'font-semibold')
    })

    it('renders card title with custom className', () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>)
      const title = screen.getByText('Custom Title')
      expect(title).toHaveClass('custom-title')
    })

    it('renders as div by default', () => {
      render(<CardTitle>Default Title</CardTitle>)
      const title = screen.getByText('Default Title')
      expect(title.tagName).toBe('DIV')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardTitle ref={ref}>Ref Title</CardTitle>)
      expect(ref.current).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })
  })

  describe('CardDescription', () => {
    it('renders card description with default props', () => {
      render(<CardDescription>Card description</CardDescription>)
      const description = screen.getByText('Card description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('text-muted-foreground', 'text-sm')
    })

    it('renders card description with custom className', () => {
      render(<CardDescription className="custom-desc">Custom Description</CardDescription>)
      const description = screen.getByText('Custom Description')
      expect(description).toHaveClass('custom-desc')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLParagraphElement>()
      render(<CardDescription ref={ref}>Ref Description</CardDescription>)
      expect(ref.current).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<CardDescription>Card description</CardDescription>)
      const description = screen.getByText('Card description')
      expect(description).toHaveAttribute('data-slot', 'card-description')
    })
  })

  describe('CardContent', () => {
    it('renders card content with default props', () => {
      render(<CardContent>Content here</CardContent>)
      const content = screen.getByText('Content here')
      expect(content).toBeInTheDocument()
      expect(content).toHaveClass('px-6')
    })

    it('renders card content with custom className', () => {
      render(<CardContent className="custom-content">Custom Content</CardContent>)
      const content = screen.getByText('Custom Content')
      expect(content).toHaveClass('custom-content')
    })

    it('forwards ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<CardContent ref={ref}>Ref Content</CardContent>)
      expect(ref.current).toBeInTheDocument()
    })

    it('has correct data-slot attribute', () => {
      render(<CardContent>Content here</CardContent>)
      const content = screen.getByText('Content here')
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })
  })

  describe('Card Composition', () => {
    it('renders complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card</CardTitle>
            <CardDescription>This is a complete card example</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Main content area</p>
          </CardContent>
        </Card>
      )

      expect(screen.getByText('Complete Card')).toBeInTheDocument()
      expect(screen.getByText('This is a complete card example')).toBeInTheDocument()
      expect(screen.getByText('Main content area')).toBeInTheDocument()
    })

    it('maintains proper nesting structure', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Nested Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content</p>
          </CardContent>
        </Card>
      )

      const card = container.firstChild as HTMLElement
      const header = card.querySelector('[data-slot="card-header"]')
      const content = card.querySelector('[data-slot="card-content"]')

      expect(header).toBeInTheDocument()
      expect(content).toBeInTheDocument()
    })

    it('applies consistent spacing', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Spacing Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content with spacing</p>
          </CardContent>
        </Card>
      )

      const header = screen.getByText('Spacing Test').parentElement
      const content = screen.getByText('Content with spacing').parentElement

      expect(header).toHaveClass('px-6')
      expect(content).toHaveClass('px-6')
    })
  })

  describe('Data Attributes', () => {
    it('maintains proper data-slot attributes', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
        </Card>
      )

      const card = screen.getByText('Test Title').closest('[data-slot="card"]')
      const header = screen.getByText('Test Title').closest('[data-slot="card-header"]')
      const title = screen.getByText('Test Title')

      expect(card).toHaveAttribute('data-slot', 'card')
      expect(header).toHaveAttribute('data-slot', 'card-header')
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })
  })

  describe('Styling Consistency', () => {
    it('applies consistent border radius and shadows', () => {
      render(<Card>Styled Card</Card>)
      const card = screen.getByText('Styled Card')
      
      expect(card).toHaveClass('rounded-xl', 'shadow-sm')
    })

    it('applies consistent flexbox layout', () => {
      render(<Card>Flex Card</Card>)
      const card = screen.getByText('Flex Card')
      
      expect(card).toHaveClass('flex', 'flex-col', 'gap-6')
    })

    it('applies consistent padding', () => {
      render(<Card>Padded Card</Card>)
      const card = screen.getByText('Padded Card')
      
      expect(card).toHaveClass('py-6')
    })
  })
})
