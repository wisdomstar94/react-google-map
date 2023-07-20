import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'react-google-map test geo-fence',
  description: 'react-google-map test geo-fence',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>{children}</>
  );
}
