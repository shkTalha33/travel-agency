import './globals.css';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: 'Círculo Wingding — Portal Administrativo',
  description: 'Sistema integral de gestión de ofertas, miembros, comisiones y redenciones.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full bg-sand-50" suppressHydrationWarning>
      <body className="h-full antialiased font-sans text-navy-950 bg-sand-50" suppressHydrationWarning>
        <LanguageProvider>
          <AdminAuthProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </AdminAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

