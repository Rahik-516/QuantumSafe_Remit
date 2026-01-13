import type { Metadata } from 'next';
import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'QuantumSafe — Secure Remittance',
  description: 'Secure remittance with quantum-safe practices and a modern glassmorphism UI.',
  // You can expand with icons, openGraph, twitter, etc.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>QuantumSafe Remit</title>
        <meta name="description" content="Quantum-Safe AI Remittance Optimizer for Bangladeshi Diaspora" />
        <meta name="keywords" content="remittance, quantum, encryption, Bangladesh, AI" />
      </head>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
