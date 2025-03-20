import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, onChange, ...props }, ref) => {
  // Simple direct onChange handler that preserves all IME functionality
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original onChange handler directly
    // This ensures all IME and character encoding information is preserved
    if (onChange) {
      onChange(e);
    }
  }, [onChange]);

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      onChange={handleChange}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }