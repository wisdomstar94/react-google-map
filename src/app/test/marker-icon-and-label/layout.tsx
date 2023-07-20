import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test marker-icon-and-label',
  description: 'react-google-map test marker-icon-and-label',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
