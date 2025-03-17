import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Type definitions for Select component props
 */
type SelectTriggerProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;
type SelectContentProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>;
type SelectItemProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>;
type SelectScrollButtonProps = React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>;

/**
 * Root Select component
 * @component
 */
const Select = SelectPrimitive.Root;

/**
 * Select Group component for grouping items
 * @component
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * Select Value component for displaying selected value
 * @component
 */
const SelectValue = SelectPrimitive.Value;

/**
 * Trigger button for the select dropdown
 * @component
 */
const SelectTrigger = React.memo(
    React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
        ({ className, children, ...props }, ref) => (
            <SelectPrimitive.Trigger
                ref={ref}
                className={cn(
                    "flex h-6 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
                    "ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2",
                    "focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    "[&>span]:line-clamp-1",
                    className
                )}
                {...props}
            >
                {children}
                <SelectPrimitive.Icon asChild>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
        )
    )
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * Select scroll navigation buttons
 * @component
 */
const SelectScrollUpButton = React.memo(
    React.forwardRef<HTMLDivElement, SelectScrollButtonProps>(
        ({ className, ...props }, ref) => (
            <SelectPrimitive.ScrollUpButton
                ref={ref}
                className={cn("flex cursor-default items-center justify-center py-1", className)}
                {...props}
            >
                <ChevronUp className="h-4 w-4" />
            </SelectPrimitive.ScrollUpButton>
        )
    )
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

const SelectScrollDownButton = React.memo(
    React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>>(
        ({ className, ...props }, ref) => (
            <SelectPrimitive.ScrollDownButton
                ref={ref}
                className={cn("flex cursor-default items-center justify-center py-1", className)}
                {...props}
            >
                <ChevronDown className="h-4 w-4" />
            </SelectPrimitive.ScrollDownButton>
        )
    )
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

/**
 * Content container for the select dropdown
 * @component
 */
const SelectContent = React.memo(
    React.forwardRef<HTMLDivElement, SelectContentProps>(
        ({ className, children, position = "popper", ...props }, ref) => (
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    ref={ref}
                    className={cn(
                        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md",
                        // Animation classes
                        "data-[state=open]:animate-in data-[state=closed]:animate-out",
                        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                        // Positioning classes
                        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                        position === "popper" &&
                        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                        className
                    )}
                    position={position}
                    {...props}
                >
                    <SelectScrollUpButton />
                    <SelectPrimitive.Viewport
                        className={cn(
                            "p-1",
                            position === "popper" &&
                            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                        )}
                    >
                        {children}
                    </SelectPrimitive.Viewport>
                    <SelectScrollDownButton />
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        )
    )
);
SelectContent.displayName = "SelectContent";

/**
 * Label for select groups
 * @component
 */
const SelectLabel = React.memo(
    React.forwardRef<
        HTMLDivElement,
        React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
    >(({ className, ...props }, ref) => (
        <SelectPrimitive.Label
            ref={ref}
            className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
            {...props}
        />
    ))
);
SelectLabel.displayName = "SelectLabel";

/**
 * Selectable item component
 * @component
 */
const SelectItem = React.memo(
    React.forwardRef<HTMLDivElement, SelectItemProps>(
        ({ className, children, ...props }, ref) => (
            <SelectPrimitive.Item
                ref={ref}
                className={cn(
                    "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm",
                    "outline-none focus:bg-accent focus:text-accent-foreground",
                    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    className
                )}
                {...props}
            >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    <SelectPrimitive.ItemIndicator>
                        <Check className="h-4 w-4" />
                    </SelectPrimitive.ItemIndicator>
                </span>

                <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
            </SelectPrimitive.Item>
        )
    )
);
SelectItem.displayName = "SelectItem";

/**
 * Separator line for select dropdown
 * @component
 */
const SelectSeparator = React.memo(
    React.forwardRef<
        HTMLDivElement,
        React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
    >(({ className, ...props }, ref) => (
        <SelectPrimitive.Separator
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-muted", className)}
            {...props}
        />
    ))
);
SelectSeparator.displayName = "SelectSeparator";

/**
 * Select Component API
 */
export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
};

/**
 * Custom Select component with simplified API
 * @example
 * <CustomSelect
 *   value={selectedValue}
 *   onValueChange={handleValueChange}
 *   placeholder={t('common.selectPlaceholder')}
 *   disabled={isDisabled}
 *   items={[
 *     { value: "item1", label: t('options.item1') },
 *     { value: "item2", label: t('options.item2') }
 *   ]}
 * />
 */
export interface CustomSelectProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    items: Array<{ value: string; label: string }>;
    className?: string;
    triggerClassName?: string;
    noItemsMessage?: string;
}

export const CustomSelect = React.memo(({
    value,
    onValueChange,
    placeholder,
    disabled,
    items,
    className,
    triggerClassName,
    noItemsMessage
}: CustomSelectProps) => {
    // Memoize the items to prevent unnecessary re-renders
    const selectItems = React.useMemo(() => (
        items.map((item) => (
            <SelectItem key={`select-item-${item.value}`} value={item.value}>
                {item.label}
            </SelectItem>
        ))
    ), [items]);

    return (
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
            <div className={className}>
                <SelectTrigger className={triggerClassName}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {items.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                            {noItemsMessage || "No items available"}
                        </div>
                    ) : selectItems}
                </SelectContent>
            </div>
        </Select>
    );
});

CustomSelect.displayName = "CustomSelect";