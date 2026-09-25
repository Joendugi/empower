import { clsx } from 'clsx';

interface LoadingSpinnerProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function LoadingSpinner({ fullScreen = false, size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[size];
  const borderClass = { sm: 'border-2', md: 'border-[3px]', lg: 'border-4' }[size];

  const spinner = (
    <div
      className={clsx(
        sizeClass,
        borderClass,
        'rounded-full border-surface-light border-t-accent animate-spin'
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-primary-dark">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center p-8">{spinner}</div>;
}
