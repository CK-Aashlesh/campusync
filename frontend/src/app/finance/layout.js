'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function FinanceLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // If ProtectedRoute is doing its job, user is guaranteed to be Admin here (or loading).
  const financeName = user?.name || 'Finance';
  const isActive = (path) => pathname === path;

  return (
    <ProtectedRoute allowedRoles={['Finance']}>
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
                <Link href="/finance" className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isActive('/finance') ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Finance">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </Link>
              </nav>
            </div>
            
            <div className="flex md:flex-col items-center space-x-2 md:space-x-0 md:space-y-3 w-full">
              <button onClick={logout} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer" title="Logout">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
              </button>
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-sm cursor-pointer" title="Finance Profile">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm">
                  {financeName.charAt(0)}
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
                  Hi, {financeName} <span className="text-xl">👋</span>
                </h1>
                <p className="text-xs sm:text-sm text-black mt-1 font-medium">
                  Finance Officer
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


