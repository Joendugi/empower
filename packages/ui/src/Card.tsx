import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx('bg-surface rounded-lg p-5 border border-white/[0.08]', className)}
      {...props}
    />
  );
}
