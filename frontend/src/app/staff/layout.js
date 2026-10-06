'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function StaffLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['Staff']}>
      {children}
    </ProtectedRoute>
  );
}
