import './globals.css';
import type { Metadata } from 'next';
import { Courier_Prime } from 'next/font/google';

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-courier-prime',
});

export const metadata: Metadata = {
  title: 'SAEZ - Culture contre culture',
  description: 'Site officiel de SAEZ - Culture contre culture',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${courierPrime.variable} font-mono min-h-screen`}>
        {children}
      </body>
    </html>
  );
}