import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test',
  description: 'react-google-map test',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
