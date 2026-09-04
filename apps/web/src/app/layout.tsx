import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zeemo — AI Engineering Incident Investigation Platform',
  description:
    'Investigate production incidents across code, logs, deployments, and runbooks with an evidence-backed multi-agent platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-blue-600/30 selection:text-blue-200">
        {children}
      </body>
    </html>
  );
}
