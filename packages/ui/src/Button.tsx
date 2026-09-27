import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  secondary:
    'bg-transparent text-white border border-white/15 hover:bg-white/[0.06] hover:border-white/25 disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'text-muted hover:text-white hover:bg-white/[0.05]',
};

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium py-2.5 px-5 rounded-md transition-colors duration-150',
        variantClass[variant],
        className,
      )}
      {...props}
    />
  );
}
