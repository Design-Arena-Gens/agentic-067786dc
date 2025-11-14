import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "De Jongh's Panelbeating Centre Assistant",
  description:
    'Friendly AI assistant for De Jongh\'s Panelbeating Centre providing repair estimates, updates, and maintenance advice.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
