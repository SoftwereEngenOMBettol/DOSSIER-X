"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "default" | "compact";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  children: React.ReactNode;
}

/**
 * Primitive action button.
 *
 * Rules from UI_IMPLEMENTATION_GUIDE.md:
 * - Primary: gold background
 * - Secondary: dark background
 * - Danger: dark red background
 * - Radius: 12px, Height: 48px, Label: 15px SemiBold
 * - No bounce in transitions; 200–300ms max
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "secondary", size = "default", icon, iconPosition = "start", className, children, ...props },
    ref,
  ) => {
    const variantClasses: Record<ButtonVariant, string> = {
      primary: "bg-gold text-bg-primary hover:brightness-110",
      secondary: "bg-card text-text-primary border border-border hover:bg-bg-secondary",
      danger: "bg-dark-red text-text-primary hover:brightness-110",
      ghost: "bg-transparent text-text-secondary hover:text-text-primary",
    };

    const sizeClasses: Record<ButtonSize, string> = {
      default: "h-12 px-5 text-[15px]",
      compact: "h-9 px-3 text-sm",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-button font-semibold",
          "transition-colors duration-fast disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {icon && iconPosition === "start" && <span className="shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === "end" && <span className="shrink-0">{icon}</span>}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
