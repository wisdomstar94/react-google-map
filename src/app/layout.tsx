import './globals.css';
import type { Metadata } from 'next';
import RootLayoutClient from './layout-client';

export const metadata: Metadata = {
  title: 'react-google-map',
  description: 'react-google-map',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <RootLayoutClient />
        {children}
      </body>
    </html>
  );
}
