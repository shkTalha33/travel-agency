import './globals.css';
import { AdminAuthProvider } from '@/context/AdminAuthContext';
import { LanguageProvider } from '@/context/LanguageContext';

export const metadata = {
  title: 'Viajes Dominicana — Portal Administrativo',
  description: 'Sistema integral de gestión de ofertas, miembros, comisiones y redenciones.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full bg-sand-50">
      <body className="h-full antialiased font-sans text-navy-950 bg-sand-50">
        <LanguageProvider>
          <AdminAuthProvider>
            {children}
          </AdminAuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

