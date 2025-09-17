import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-bold rounded-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-neon-gradient text-white hover:shadow-lg hover:shadow-neon-pink/50',
    secondary: 'bg-dark-surface border border-dark-border text-white hover:border-neon-cyan',
    outline: 'border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
