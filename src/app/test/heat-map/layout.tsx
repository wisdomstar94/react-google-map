import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test heat-map',
  description: 'react-google-map test heat-map',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
