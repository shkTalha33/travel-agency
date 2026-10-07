import './globals.css';
import { AppStoreProvider } from '@/store';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/components/ui/Toast';
import SkipLink from '@/components/layout/SkipLink';

export const metadata = {
  title: 'Círculo Wingding — Travel. Share. Earn.',
  description:
    'Luxury travel and referral club. Explore offers, build your network, and earn points based on your membership.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppStoreProvider>
          <LanguageProvider>
            <SkipLink />
            <AuthProvider>
              <ToastProvider>{children}</ToastProvider>
            </AuthProvider>
          </LanguageProvider>
        </AppStoreProvider>
      </body>
    </html>
  );
}

