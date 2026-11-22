'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    // Primary using Forest Cream dark green
    primary:
      'bg-[#0F2A24] text-[#F2EEE3] hover:bg-[#173B32] focus:ring-[#173B32] shadow-sm',
    // Secondary forest lighter green
    secondary:
      'bg-[#173B32] text-[#F2EEE3] hover:bg-[#1E4D41] focus:ring-[#1E4D41]',
    // Accent using warm gold
    accent:
      'bg-[#D8C28A] text-[#0F2A24] hover:bg-[#C5A55D] focus:ring-[#D8C28A] shadow-sm font-bold',
    // Outline
    outline:
      'border-2 border-[#173B32]/30 text-[#0F2A24] bg-white hover:bg-[#F2EEE3]/50 focus:ring-[#173B32]',
    // Ghost
    ghost:
      'text-[#0F2A24] hover:bg-[#173B32]/10 focus:ring-[#173B32]',
    // Danger
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500 shadow-sm',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-bold',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
