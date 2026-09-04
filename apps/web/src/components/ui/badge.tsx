import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold font-mono transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive/20 text-red-400 border-red-500/30',
        outline: 'text-foreground border-border',
        critical: 'border-red-500/40 bg-red-950/40 text-red-400',
        high: 'border-amber-500/40 bg-amber-950/40 text-amber-400',
        medium: 'border-yellow-500/40 bg-yellow-950/40 text-yellow-400',
        low: 'border-blue-500/40 bg-blue-950/40 text-blue-400',
        success: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-400',
        muted: 'border-border bg-muted/60 text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
