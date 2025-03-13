import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
    "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-indigo-500 p-[0.1rem]",
    {
        variants: {
            variant: {
                default: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
                success: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
                info: "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
                warning: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
                danger: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
                purple: "data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-slate-700",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface SwitchProps extends
    React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> { }

// Fixed version without using the deprecated ElementRef
const Switch = React.forwardRef<
    React.ComponentRef<typeof SwitchPrimitives.Root>,
    SwitchProps
>(({ className, variant, ...props }, ref) => (
    <SwitchPrimitives.Root
        className={cn(switchVariants({ variant }), className)}
        {...props}
        ref={ref}
    >
        <SwitchPrimitives.Thumb
            className={cn(
                "pointer-events-none block h-4 w-4 rounded-full bg-background dark:bg-slate-200 shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
            )}
        />
    </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };