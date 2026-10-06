'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // If ProtectedRoute is doing its job, user is guaranteed to be Admin here (or loading).
  const adminName = user?.name || 'Admin';
  const isActive = (path) => pathname === path;

  return (
    <ProtectedRoute allowedRoles={['Admin']}>
      <div className="min-h-screen bg-[#dfe6f1] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
        <div className="w-full max-w-[1380px] bg-[#f2f5fa] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 flex flex-col md:flex-row overflow-hidden relative h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)] lg:h-[860px]">
          
          {/* ===================== LEFT SIDEBAR ===================== */}
          <aside className="w-full md:w-[76px] bg-white border-b md:border-b-0 md:border-r border-gray-100/90 flex md:flex-col items-center justify-between p-3.5 md:py-6 flex-shrink-0 z-30">
            
            <div className="flex md:flex-col items-center space-x-3 md:space-x-0 md:space-y-6 w-full">
              {/* Brand Logo Badge */}
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md shadow-blue-500/25 tracking-tighter text-lg cursor-pointer transform hover:scale-105 transition-all">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="7" height="16" rx="2" fill="white" />
                  <rect x="4" y="13" width="16" height="7" rx="2" fill="white" />
                </svg>
              </div>

              {/* Navigation Icons */}
              <nav className="flex md:flex-col items-center space-x-1 md:space-x-0 md:space-y-2.5 w-full px-1 md:px-2.5 overflow-x-auto md:overflow-visible">
                
                <Link href="/admin" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive('/admin') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Dashboard">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10" />
                  </svg>
                </Link>

                <Link href="/admin/semester-promotion" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive('/admin/semester-promotion') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Semester Promotion">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </Link>

                

                

                

                <Link href="/admin/staff" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive('/admin/staff') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Staff Management">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </Link>

                

                <Link href="/admin/audit-logs" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive('/admin/audit-logs') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Audit Logs">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V8.25zM6.75 21h6.375" />
                  </svg>
                </Link>
              </nav>
            </div>
            
            <div className="flex md:flex-col items-center space-x-2 md:space-x-0 md:space-y-3 w-full">
              <button onClick={logout} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer" title="Logout">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-sm cursor-pointer" title="Admin Profile">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm">
                  {adminName.charAt(0)}
                </div>
              </div>
            </div>
          </aside>

          {/* ===================== MAIN CONTENT AREA ===================== */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            {/* Top Header */}
            <header className="px-5 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f2f5fa] border-b border-gray-200/50 flex-shrink-0 z-20">
              <div>
                <h1 className="text-[22px] sm:text-2xl font-black text-black tracking-tight flex items-center gap-2">
                  Hi, {adminName} <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-black mt-1 font-medium">
                  Administrator
                </p>
              </div>
            </header>

            {/* Children / Sub-pages Render Here */}
            <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#f2f5fa]">
              {children}
            </main>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}


