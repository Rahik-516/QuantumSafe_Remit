'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
}: ButtonProps) {
  const baseStyles =
    'px-4 py-2 rounded-lg font-semibold transition disabled:opacity-50';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-600 to-emerald-600 text-white hover:shadow-lg',
    secondary:
      'border-2 border-gray-300 text-gray-700 hover:border-indigo-600 hover:text-indigo-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
