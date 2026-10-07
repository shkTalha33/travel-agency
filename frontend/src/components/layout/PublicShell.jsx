import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function PublicShell({ children }) {
  return (
    <>
      <Header />
      <main id="contenido" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
