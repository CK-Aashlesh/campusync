const fs = require('fs');
const path = require('path');
const dirs = ['admin', 'staff', 'student', 'admission'];

dirs.forEach(dir => {
  const dirPath = path.join('src', 'app', dir);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const roleName = dir === 'admission' ? 'Admission Staff' : dir.charAt(0).toUpperCase() + dir.slice(1);
  const compName = roleName.replace(' ', '');
  
  const layoutContent = `'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function ${compName}Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['${roleName}']}>
      {children}
    </ProtectedRoute>
  );
}
`;
  fs.writeFileSync(path.join(dirPath, 'layout.js'), layoutContent);

  const pageContent = `export default function ${compName}Dashboard() {
  return <div className="p-8"><h1 className="text-2xl font-bold">${roleName} Dashboard</h1></div>;
}
`;
  fs.writeFileSync(path.join(dirPath, 'page.js'), pageContent);
});
