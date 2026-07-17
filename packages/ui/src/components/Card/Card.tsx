"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/cn";

export interface CardProps extends HTMLMotionProps<"div"> {
  /** Applies the gold-border lift-on-hover treatment seen on Archive cards. */
  interactive?: boolean;
  children: React.ReactNode;
}

/**
 * Base surface component.
 * Radius: 18px. Shadow: soft, never exaggerated.
 * Interactive cards lift 4px and gain a gold border on hover (Archive spec).
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ interactive = false, className, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "rounded-card border border-border bg-card shadow-card",
          interactive && "cursor-pointer transition-shadow duration-base",
          className,
        )}
        whileHover={
          interactive
            ? { y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.45)", borderColor: "var(--color-gold)" }
            : undefined
        }
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

Card.displayName = "Card";
