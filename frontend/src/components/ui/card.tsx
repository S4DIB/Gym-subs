import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Main card container component
 * 
 * Provides a styled container with background, border, shadow, and rounded corners.
 * Used as the foundation for card-based layouts throughout the application.
 * 
 * @param {Object} props - Card component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card container
 * 
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>Card content goes here</CardContent>
 * </Card>
 * ```
 */
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card header section component
 * 
 * Contains the title and description of the card, positioned at the top.
 * Uses CSS Grid for responsive layout and supports action buttons.
 * 
 * @param {Object} props - CardHeader component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card header
 * 
 * @example
 * ```tsx
 * <CardHeader>
 *   <CardTitle>User Profile</CardTitle>
 *   <CardDescription>Manage your account settings</CardDescription>
 * </CardHeader>
 * ```
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card title component
 * 
 * Displays the main heading for the card with consistent typography styling.
 * Uses semantic font weight and line height for readability.
 * 
 * @param {Object} props - CardTitle component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card title
 * 
 * @example
 * ```tsx
 * <CardTitle>Monthly Report</CardTitle>
 * ```
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  )
}

/**
 * Card description component
 * 
 * Provides secondary text below the title with muted styling.
 * Used for additional context or explanatory text.
 * 
 * @param {Object} props - CardDescription component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card description
 * 
 * ```tsx
 * <CardDescription>View your workout statistics and progress</CardDescription>
 * ```
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

/**
 * Card action component
 * 
 * Positioned in the top-right corner of the card header.
 * Typically contains action buttons or controls related to the card content.
 * 
 * @param {Object} props - CardAction component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card action area
 * 
 * @example
 * ```tsx
 * <CardAction>
 *   <Button variant="ghost" size="icon">
 *     <MoreVerticalIcon />
 *   </Button>
 * </CardAction>
 * ```
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Card content component
 * 
 * Main content area of the card with consistent padding.
 * Contains the primary information or interactive elements.
 * 
 * @param {Object} props - CardContent component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card content area
 * 
 * @example
 * ```tsx
 * <CardContent>
 *   <p>This is the main content of the card.</p>
 *   <Button>Action Button</Button>
 * </CardContent>
 * ```
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  )
}

/**
 * Card footer component
 * 
 * Bottom section of the card, typically containing secondary actions,
 * metadata, or additional information.
 * 
 * @param {Object} props - CardFooter component props
 * @param {string} [props.className] - Additional CSS classes to apply
 * @param {React.HTMLAttributes<HTMLDivElement>} props - Standard div HTML attributes
 * @returns {JSX.Element} Rendered card footer
 * 
 * @example
 * ```tsx
 * <CardFooter>
 *   <span className="text-sm text-muted-foreground">Last updated: 2 hours ago</span>
 *   <Button variant="outline">View Details</Button>
 * </CardFooter>
 * ```
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
