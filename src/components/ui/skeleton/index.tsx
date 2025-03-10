import React from 'react';
import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
  loading?: boolean
}

export function Skeleton({ className, loading = true, ...props }: SkeletonProps) {
  if (!loading) return null

  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
      {...props}
    />
  )
}