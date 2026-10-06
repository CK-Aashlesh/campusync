'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function StaffDashboard() {
  const { user, api, loading: authLoading, logout } = useAuth();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive UI states
  const [selectedDay, setSelectedDay] = useState(12); // Wednesday 12
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSidebarTab, setActiveSidebarTab] = useState('home');

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      if (!authLoading && user) {
        try {
          const res = await api.get('/api/staff/me');
          if (isMounted) setStaffData(res.data.data);
        } catch {
          // Graceful fallback to rich defaults
        } finally {
          if (isMounted) setLoading(false);
        }
      } else if (!authLoading && !user) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [authLoading, user, api]);

  // Staff info variables with dynamic backend data and realistic defaults
  const staffName = user?.name || 'Dr. Cintia Raman';
  const departmentName = staffData?.department && staffData?.department !== 'General' 
    ? staffData.department 
    : 'Computer Science & Engineering';
  const designation = staffData?.designation || 'Lead Faculty & Mentor';
  const employeeId = staffData?.employeeId || 'KVG-FAC-4082';

  // Days in calendar strip matching mockup
  const weekDays = [
    { day: 'Sun', date: 9, dots: [] },
    { day: 'Mon', date: 10, dots: ['amber'] },
    { day: 'Tue', date: 11, dots: [] },
    { day: 'Wed', date: 12, dots: ['blue', 'blue', 'blue'] },
    { day: 'Thu', date: 13, dots: [] },
    { day: 'Fri', date: 14, dots: ['blue', 'blue'] },
    { day: 'Sat', date: 15, dots: [] },
  ];

  // Subjects / Learning Progress courses matching mockup aesthetic
  const initialCourses = [
    {
      id: 1,
      name: 'Data Structures and Algorithms',
      code: 'CS-301',
      batch: 'Semester 5 • Section A',
      progress: 80,
      due: 'Mar 10',
      status: 'overdue',
      type: 'cyber',
    },
    {
      id: 2,
      name: 'Operating Systems',
      code: 'CS-401',
      batch: 'Semester 3 • Section B',
      progress: 65,
      due: 'Today',
      status: 'today',
      type: 'comm',
    },
    {
      id: 3,
      name: 'Computer Networks',
      code: 'CS-501',
      batch: 'Semester 4 • Batch 1',
      progress: 0,
      due: 'Tomorrow',
      status: 'upcoming',
      type: 'logic',
    },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-[#edf2f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-black">Loading CampuSync Faculty Portal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfe6f1] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
      
      {/* Outer Dashboard Floating Window Container */}
      <div className="w-full max-w-[1380px] bg-[#f2f5fa] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* ===================== LEFT SIDEBAR ===================== */}
        <aside className="w-full md:w-[76px] bg-white border-b md:border-b-0 md:border-r border-gray-100/90 flex md:flex-col items-center justify-between p-3.5 md:py-6 flex-shrink-0 z-30">
          
          <div className="flex md:flex-col items-center space-x-3 md:space-x-0 md:space-y-6 w-full">
            {/* Brand Logo Badge ("LL" / "CS" Stylized emblem) */}
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md shadow-blue-500/25 tracking-tighter text-lg cursor-pointer transform hover:scale-105 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="7" height="16" rx="2" fill="white" />
                <rect x="4" y="13" width="16" height="7" rx="2" fill="white" />
              </svg>
            </div>

            {/* Navigation Icons Stack */}
            <nav className="flex md:flex-col items-center space-x-1 md:space-x-0 md:space-y-2.5 w-full px-1 md:px-2.5 overflow-x-auto md:overflow-visible">
              
              {/* 1. Dashboard (Home) */}
              <button
                onClick={() => setActiveSidebarTab('home')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarTab === 'home' ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-black hover:text-blue-600 hover:bg-gray-50'
                }`}
                title="Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </button>

              {/* 2. Subjects / Courses */}
              <button
                onClick={() => setActiveSidebarTab('subjects')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarTab === 'subjects' ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-black hover:text-blue-600 hover:bg-gray-50'
                }`}
                title="Subjects"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </button>

              {/* 3. Students / Community */}
              <button
                onClick={() => setActiveSidebarTab('students')}
                className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  activeSidebarTab === 'students' ? 'bg-blue-50 text-blue-600 shadow-sm'
                    : 'text-black hover:text-blue-600 hover:bg-gray-50'
                }`}
                title="Students"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </button>

              {/* 4. Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="w-11 h-11 rounded-xl text-black hover:text-blue-600 hover:bg-gray-50 flex items-center justify-center transition-all cursor-pointer"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* 5. Calendar / Schedule */}
              <Link
                href="/staff/attendance"
                className="w-11 h-11 rounded-xl text-black hover:text-blue-600 hover:bg-gray-50 flex items-center justify-center transition-all"
                title="Schedule & Attendance"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </Link>

              {/* 6. Rewards / Mentorship */}
              <Link
                href="/staff/mentor"
                className="w-11 h-11 rounded-xl text-black hover:text-blue-600 hover:bg-gray-50 flex items-center justify-center transition-all"
                title="Mentorship & Cases"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              </Link>


            </nav>
          </div>

          {/* Bottom Help / Logout Action */}
          <div className="hidden md:flex flex-col items-center space-y-3">
            <button
              onClick={() => logout()}
              className="w-10 h-10 rounded-xl bg-gray-100/90 hover:bg-red-50 hover:text-red-600 text-black flex items-center justify-center transition-colors cursor-pointer"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        </aside>

        {/* ===================== MAIN CANVAS ===================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* TOP HEADER BAR */}
          <header className="h-16 px-6 sm:px-8 flex items-center justify-between border-b border-gray-100/80 bg-white/70 backdrop-blur-sm z-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-black hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-black uppercase tracking-widest hidden sm:inline">
                  KVGCE
                </span>
                <span className="text-black hidden sm:inline">•</span>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md hidden sm:inline">
                  {departmentName}
                </span>
              </div>
            </div>

            {/* Top Right Controls */}
            <div className="flex items-center space-x-3.5 sm:space-x-5">
              
              {/* Search Toggle */}
              <div className="relative">
                {searchOpen ? (
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search courses, students, rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 sm:w-64 py-1.5 px-3 pl-8 text-xs bg-gray-100/90 rounded-xl border border-gray-200 outline-none focus:border-blue-500 transition-all text-black"
                  />
                ) : (
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="text-black hover:text-black transition-colors p-1"
                    aria-label="Search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                )}
                {searchOpen && (
                  <svg className="w-3.5 h-3.5 text-black absolute left-2.5 top-2.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                )}
              </div>



              {/* User Avatar with Profile details */}
              <div className="flex items-center space-x-3 pl-3 border-l border-gray-200">
                <div className="hidden sm:flex flex-col items-end text-right mr-1">
                  <span className="text-sm font-bold text-black leading-tight">{staffName}</span>
                  <span className="text-[11px] font-medium text-black">{designation}</span>
                </div>
                <div
                  className="w-10 h-10 rounded-full ring-2 ring-blue-500/20 overflow-hidden bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white font-bold text-sm shadow-sm cursor-pointer"
                  title={`${staffName} (${employeeId})`}
                >
                  {staffName.charAt(0) || 'F'}
                </div>
              </div>

            </div>
          </header>

          {/* DASHBOARD BODY */}
          <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
              
              {/* ===================== LEFT 8-COLUMNS ===================== */}
              <div className="lg:col-span-8 flex flex-col space-y-6 sm:space-y-7">
                
                {/* 1. HERO GREETING CARD WITH OVERLAPPING FLOATING CARD */}
                <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-100/90 shadow-[0_4px_25px_-5px_rgba(20,40,90,0.04)]">
                  
                  {/* Left greeting text */}
                  <div className="max-w-xs sm:max-w-md">
                    <h1 className="text-2xl sm:text-[28px] font-bold text-black tracking-tight leading-tight">
                      Good morning, {staffName.split(' ')[0]}
                    </h1>
                    <p className="text-black text-sm mt-1.5 leading-relaxed font-normal">
                      Let&apos;s Mark Attendance guiding students and managing academic schedules.
                    </p>

                    {/* Skill / Specialization Tags */}
                    <div className="mt-5 sm:mt-6">
                      <span className="text-[11px] font-semibold text-black block mb-2 uppercase tracking-wider">
                        Assigned Specializations:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100/80">
                          Database Architecture
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-slate-50 text-black text-xs font-semibold border border-slate-200/80">
                          Algorithm Strategy
                        </span>
                        <span className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-black text-xs font-semibold">
                          +4
                        </span>
                      </div>
                    </div>

                    {/* Daily Attendance Progress Bar */}
                    <div className="mt-6 sm:mt-7 pt-1">
                      <div className="flex justify-between items-center text-xs font-bold text-black mb-2">
                        <span>70% complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: '70%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Overlapping Featured Floating Card (Matches Mockup exact positioning!) */}
                  <div className="mt-6 md:mt-0 md:absolute md:-top-4 md:right-6 lg:right-8 w-full md:w-[245px] bg-white rounded-2xl p-4 shadow-[0_15px_40px_-10px_rgba(20,40,90,0.14)] border border-gray-100/90 z-10 transition-transform hover:-translate-y-1 duration-200">
                    
                    {/* Header Illustration (Matching mockup's people illustration) */}
                    <div className="w-full h-28 rounded-xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 overflow-hidden relative flex items-center justify-center">
                      <svg viewBox="0 0 200 120" className="w-full h-full object-cover">
                        {/* Background subtle geometric shapes */}
                        <circle cx="160" cy="35" r="38" fill="#93c5fd" opacity="0.35" />
                        <circle cx="35" cy="85" r="26" fill="#818cf8" opacity="0.25" />
                        
                        {/* Monitor / Screen */}
                        <rect x="36" y="28" width="68" height="52" rx="6" fill="#3b82f6" opacity="0.2" />
                        <rect x="42" y="34" width="56" height="38" rx="4" fill="#ffffff" />
                        <path d="M50 46 H78 M50 54 H90 M50 62 H70" stroke="#93c5fd" strokeWidth="3" strokeLinecap="round" />
                        
                        {/* Person 1 (Pink/Coral shirt - Instructor) */}
                        <circle cx="128" cy="46" r="14" fill="#f87171" />
                        <path d="M106 88 C106 66, 150 66, 150 88 Z" fill="#ef4444" />
                        
                        {/* Person 2 (Yellow shirt - Collaborator) */}
                        <circle cx="162" cy="50" r="13" fill="#fbbf24" />
                        <path d="M142 90 C142 70, 182 70, 182 90 Z" fill="#f59e0b" />
                        
                        {/* Reaching arm / gesture */}
                        <path d="M130 72 C120 74, 90 70, 80 65" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" fill="none" />
                      </svg>
                    </div>

                    {/* Card Content */}
                    <div className="mt-3">
                      <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md mb-1.5">
                        Quick Action
                      </span>
                      <h3 className="text-sm font-bold text-black leading-snug">
                        Record Today&apos;s Attendance
                      </h3>
                      <Link
                        href="/staff/attendance"
                        className="mt-3.5 block w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-sm text-center transition-colors cursor-pointer"
                      >
                        Mark Attendance
                      </Link>
                    </div>

                  </div>

                </div>

                {/* 2. STAT / METRIC CARDS ROW (4 CARDS MATCHING MOCKUP) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
                  
                  {/* Card 1: 2 Certificates (Green badge) */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100/90 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-black leading-tight">120</div><div className="text-[11px] font-medium text-black mt-0.5">Total Students</div>
                    </div>
                  </div>

                  {/* Card 2: 5 Badges (Orange shield badge) */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100/90 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 border border-amber-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-black leading-tight">4</div><div className="text-[11px] font-medium text-black mt-0.5">Assigned Subjects</div>
                    </div>
                  </div>

                  {/* Card 3: 8th Rank (Blue trophy badge) */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100/90 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 border border-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007-4.5V3.75a1.5 1.5 0 00-1.5-1.5h-3a1.5 1.5 0 00-1.5 1.5v6M12 9.75a3 3 0 100-6 3 3 0 000 6z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-black leading-tight">3</div><div className="text-[11px] font-medium text-black mt-0.5">Classes Today</div>
                    </div>
                  </div>

                  {/* Card 4: 2416 UCoins (Yellow wallet/coins badge) */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-100/90 shadow-sm flex items-center space-x-3 hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-black leading-tight">2</div><div className="text-[11px] font-medium text-black mt-0.5">Pending Tasks</div>
                    </div>
                  </div>

                </div>

                {/* 3. My Current Subjects / ACADEMIC SUBJECTS TABLE */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm">
                  
                  {/* Table Card Header */}
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <h2 className="text-base sm:text-lg font-bold text-black tracking-tight">
                      My Current Subjects
                    </h2>
                    
                    {/* Status filter pills */}
                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                        1 Overdue
                      </span>
                      <span className="px-3 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        2 Completed
                      </span>
                    </div>
                  </div>

                  {/* Table Content */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[11px] font-semibold text-black uppercase tracking-wider border-b border-gray-100 pb-3">
                          <th className="pb-3 font-medium">Course</th>
                          <th className="pb-3 font-medium text-center">Progress</th>
                          <th className="pb-3 font-medium">Due</th>
                          <th className="pb-3 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {initialCourses.map((course) => {
                          const isMenuOpen = activeMenuId === course.id;

                          return (
                            <tr key={course.id} className="group hover:bg-slate-50/70 transition-colors">
                              
                              {/* Course Name & Illustration icon */}
                              <td className="py-4 pr-3 sm:pr-4">
                                <div className="flex items-center space-x-3.5">
                                  {/* Custom miniature vector illustration icon */}
                                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-gray-100/80">
                                    {course.type === 'cyber' && (
                                      <svg viewBox="0 0 40 40" className="w-full h-full">
                                        <rect width="40" height="40" fill="#eff6ff" />
                                        <circle cx="20" cy="18" r="8" fill="#3b82f6" />
                                        <path d="M12 32 C12 26 28 26 28 32 Z" fill="#60a5fa" />
                                        <rect x="23" y="12" width="10" height="8" rx="2" fill="#fbbf24" />
                                      </svg>
                                    )}
                                    {course.type === 'comm' && (
                                      <svg viewBox="0 0 40 40" className="w-full h-full">
                                        <rect width="40" height="40" fill="#ecfdf5" />
                                        <circle cx="14" cy="17" r="5" fill="#10b981" />
                                        <path d="M8 29 C8 24 20 24 20 29 Z" fill="#34d399" />
                                        <circle cx="26" cy="17" r="5" fill="#f87171" />
                                        <path d="M20 29 C20 24 32 24 32 29 Z" fill="#fca5a5" />
                                      </svg>
                                    )}
                                    {course.type === 'logic' && (
                                      <svg viewBox="0 0 40 40" className="w-full h-full">
                                        <rect width="40" height="40" fill="#faf5ff" />
                                        <circle cx="20" cy="16" r="7" fill="#8b5cf6" />
                                        <path d="M11 31 C11 25 29 25 29 31 Z" fill="#c084fc" />
                                        <circle cx="27" cy="12" r="3" fill="#38bdf8" />
                                      </svg>
                                    )}
                                  </div>

                                  <div>
                                    <div className="font-bold text-black leading-snug">
                                      {course.name}
                                    </div>
                                    <div className="text-xs text-black mt-0.5">
                                      {course.code} • {course.batch}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Progress Circle & Percent */}
                              <td className="py-4 px-3 sm:px-4 text-center">
                                <div className="inline-flex items-center space-x-2">
                                  <span className="text-xs font-bold text-black">
                                    {course.progress}%
                                  </span>
                                  {/* Donut progress ring */}
                                  <div className="relative w-5 h-5">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                      <circle cx="18" cy="18" r="14" stroke="#e2e8f0" strokeWidth="4" fill="none" />
                                      {course.progress > 0 && (
                                        <circle
                                          cx="18"
                                          cy="18"
                                          r="14"
                                          stroke="#10b981"
                                          strokeWidth="4"
                                          strokeDasharray="88"
                                          strokeDashoffset={88 - (88 * course.progress) / 100}
                                          strokeLinecap="round"
                                          fill="none"
                                        />
                                      )}
                                    </svg>
                                  </div>
                                </div>
                              </td>

                              {/* Due Date / Status */}
                              <td className="py-4 px-3 sm:px-4">
                                <span
                                  className={`text-xs font-bold ${
                                    course.status === 'overdue' ? 'text-red-500'
                                      : course.status === 'today' ? 'text-amber-500'
                                      : 'text-black'
                                  }`}
                                >
                                  {course.due}
                                </span>
                              </td>

                              {/* Action Menu (3 dots) */}
                              <td className="py-4 pl-3 sm:pl-4 text-right relative">
                                <button
                                  onClick={() => setActiveMenuId(isMenuOpen ? null : course.id)}
                                  className="text-black hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                  aria-label="Actions"
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                  </svg>
                                </button>

                                {/* Quick Action Popover */}
                                {isMenuOpen && (
                                  <div className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-30 text-left text-xs">
                                    <Link
                                      href="/staff/attendance"
                                      className="block px-3.5 py-2 text-black hover:bg-blue-50 hover:text-blue-600 font-medium"
                                    >
                                      Mark Attendance
                                    </Link>
                                    <Link
                                      href="/staff/mentor/students"
                                      className="block px-3.5 py-2 text-black hover:bg-blue-50 hover:text-blue-600 font-medium"
                                    >
                                      View Student Roster
                                    </Link>
                                    <Link
                                      href="/staff/subjects"
                                      className="block px-3.5 py-2 text-black hover:bg-blue-50 hover:text-blue-600 font-medium"
                                    >
                                      Subject Details
                                    </Link>
                                    <button
                                      onClick={() => setActiveMenuId(null)}
                                      className="w-full text-left px-3.5 py-2 text-black hover:bg-gray-50 border-t border-gray-50 mt-1 cursor-pointer"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                )}
                              </td>

                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>

              {/* ===================== RIGHT 4-COLUMNS ===================== */}
              <div className="lg:col-span-4 flex flex-col space-y-6 sm:space-y-7">
                
                {/* 4. CALENDAR & DAILY TIMELINE CARD */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm">
                  
                  {/* Month Header & Dropdown */}
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xl font-bold text-black tracking-tight">
                      March
                    </h3>
                    <div className="border border-gray-200/90 text-xs font-semibold px-3 py-1.5 rounded-xl text-black flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 select-none">
                      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      <span>Week</span>
                      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Week Day Strip (Interactive) */}
                  <div className="grid grid-cols-7 text-center gap-1 mb-6">
                    {weekDays.map((item) => {
                      const isSelected = selectedDay === item.date;

                      return (
                        <button
                          key={item.date}
                          onClick={() => setSelectedDay(item.date)}
                          className={`rounded-xl py-1.5 transition-all cursor-pointer ${
                            isSelected ? 'bg-blue-50 text-blue-600 font-bold shadow-sm'
                              : 'text-black hover:bg-gray-50'
                          }`}
                        >
                          <div className={`text-[11px] ${isSelected ? 'text-blue-600 font-bold' : 'text-black font-medium'}`}>
                            {item.day}
                          </div>
                          <div className={`text-xs mt-0.5 ${isSelected ? 'font-extrabold text-blue-600' : 'font-semibold'}`}>
                            {item.date}
                          </div>

                          {/* Dots indicator */}
                          <div className="flex justify-center items-center space-x-0.5 mt-1 h-1.5">
                            {isSelected ? (
                              <>
                                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-600"></span>
                              </>
                            ) : item.dots.includes('amber') ? (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                            ) : item.dots.length > 0 ? (
                              <>
                                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                                <span className="w-1 h-1 rounded-full bg-blue-400"></span>
                              </>
                            ) : null}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Today's Training / Class Schedule */}
                  <div className="border-t border-gray-100 pt-5 mb-4">
                    <h4 className="text-sm font-bold text-black tracking-tight">
                      Today&apos;s Schedule
                    </h4>
                    <p className="text-xs text-black mt-0.5">
                      Wednesday, 12 March 2025
                    </p>
                  </div>

                  {/* Timeline Cards */}
                  <div className="space-y-4">
                    
                    {/* Item 1 (8:30) */}
                    <div className="flex items-start space-x-3">
                      <span className="text-xs font-bold text-black w-11 pt-1">
                        8:30
                      </span>
                      <div className="flex-1 bg-gradient-to-r from-blue-50/90 to-blue-50/20 border-l-4 border-blue-600 rounded-r-2xl p-3.5 shadow-sm">
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100/90 px-2 py-0.5 rounded">Lecture</span>
                        <h5 className="text-xs font-bold text-black mt-1.5">
                          Data Structures (CS-301)
                        </h5>
                        <Link
                          href="/staff/attendance"
                          className="inline-block mt-2.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
                        >
                          View Roster
                        </Link>
                      </div>
                    </div>

                    {/* Item 2 (10:30) */}
                    <div className="flex items-start space-x-3">
                      <span className="text-xs font-bold text-black w-11 pt-1">
                        10:30
                      </span>
                      <div className="flex-1 bg-amber-50/30 border-l-4 border-amber-500 rounded-r-2xl p-3.5 shadow-sm">
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">Lab</span>
                        <h5 className="text-xs font-bold text-black mt-1.5 leading-snug">
                          Operating Systems Lab
                        </h5>
                        <p className="text-[11px] text-black mt-0.5">
                          Computer Lab 3
                        </p>
                      </div>
                    </div>

                    {/* Item 3 (14:00) */}
                    <div className="flex items-start space-x-3">
                      <span className="text-xs font-bold text-black w-11 pt-1">
                        14:00
                      </span>
                      <div className="flex-1 bg-indigo-50/30 border-l-4 border-indigo-500 rounded-r-2xl p-3.5 shadow-sm"><span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">Meeting</span>
                        <h5 className="text-xs font-bold text-black mt-1.5">
                          Department Meeting
                        </h5>
                        <a
                          href="https://zoom.us"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 hover:underline mt-0.5 block truncate"
                        >
                          Boardroom A
                        </a>
                      </div>
                    </div>

                  </div>

                </div>

                {/* 5. MY KPAs / ATTENDANCE BREAKDOWN PIE CHART */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="text-sm font-bold text-black">
                        My KPAs
                      </h3>
                      <button className="text-black hover:text-black cursor-pointer" title="Key Performance Area metrics">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                      </button>
                    </div>


                  </div>

                  <p className="text-xs text-black mb-4">
                    Role: {designation}
                  </p>

                  {/* Pie / Donut Chart Graphic matching mockup */}
                  <div className="flex items-center justify-center py-2">
                    <div className="relative w-44 h-44">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Blue slice (55%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#7b9cee"
                          strokeWidth="20"
                          strokeDasharray="188.5"
                          strokeDashoffset="84"
                          fill="none"
                        />
                        {/* Peach slice (25%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#fca585"
                          strokeWidth="20"
                          strokeDasharray="188.5"
                          strokeDashoffset="141"
                          fill="none"
                        />
                        {/* Yellow slice (12%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#fde68a"
                          strokeWidth="20"
                          strokeDasharray="188.5"
                          strokeDashoffset="165"
                          fill="none"
                        />
                        {/* Mint slice (8%) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="30"
                          stroke="#99f6e4"
                          strokeWidth="20"
                          strokeDasharray="188.5"
                          strokeDashoffset="173"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Legend matching chart colors */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-50 text-[11px]">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#7b9cee]"></span>
                      <span className="text-black font-medium">Curriculum (55%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fca585]"></span>
                      <span className="text-black font-medium">Mentorship (25%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fde68a]"></span>
                      <span className="text-black font-medium">Labs & Tests (12%)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#99f6e4]"></span>
                      <span className="text-black font-medium">Audits (8%)</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </main>

        </div>

      </div>
    </div>
  );
}







