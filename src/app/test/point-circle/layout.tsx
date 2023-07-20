import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test point-circle',
  description: 'react-google-map test point-circle',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
