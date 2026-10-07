import React from 'react';
import DashboardShell from '@/components/dashboard/DashboardShell';

export const metadata = { title: 'Mi panel — Viajes Dominicana' };

export default function DashboardLayout({ children }) {
  return <DashboardShell>{children}</DashboardShell>;
}
