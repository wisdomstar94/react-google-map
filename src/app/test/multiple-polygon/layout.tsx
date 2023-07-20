import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test multiple-polygon',
  description: 'react-google-map test multiple-polygon',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
