import * as React from "react"
import { cn } from "@/lib/utils"

// Add a flag to track if we're in an onChange handler
const isHandlingChange = { current: false };

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, onChange, ...props }, ref) => {
  // Create a more efficient onChange handler
  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent nested/recursive change handlers
    if (isHandlingChange.current) return;

    // Capture the value synchronously before the event is recycled
    const value = e.target.value;
    const name = e.target.name;

    isHandlingChange.current = true;

    // Use setTimeout to process the change asynchronously
    // This prevents long-running handlers from blocking the UI
    setTimeout(() => {
      if (onChange) {
        // Create a new synthetic event with the captured value
        const syntheticEvent = Object.create(e);
        // Preserve the important properties with captured values
        syntheticEvent.target = { value, name };
        syntheticEvent.currentTarget = { value, name };

        // Call the original onChange handler with our preserved event
        onChange(syntheticEvent);
      }
      isHandlingChange.current = false;
    }, 0);
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