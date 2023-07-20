import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test polygon-with-circle',
  description: 'react-google-map test polygon-with-circle',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
