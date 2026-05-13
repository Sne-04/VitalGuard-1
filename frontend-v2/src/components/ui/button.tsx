import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-sm whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-hover shadow-sm active:scale-[0.98]",
        secondary: "bg-surface text-foreground border border-border hover:bg-card-hover hover:border-muted-foreground/30 active:scale-[0.98]",
        outline: "border border-border bg-transparent text-foreground hover:bg-card-hover hover:border-muted-foreground/30",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-card-hover",
        danger: "bg-danger text-white hover:bg-danger/90 shadow-sm",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        default: "h-9 px-4",
        lg: "h-11 px-6",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
