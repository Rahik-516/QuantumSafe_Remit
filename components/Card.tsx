'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow ${
        hoverable ? 'hover:shadow-lg transition' : ''
      } p-6 ${className}`}
    >
      {children}
    </div>
  );
}
