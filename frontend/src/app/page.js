'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const { user, api, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  
  const [activeSidebarTab, setActiveSidebarTab] = useState('home');
  const [profileData, setProfileData] = useState(null);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [financeData, setFinanceData] = useState({ fees: [], fines: [] });
  const [loadingData, setLoadingData] = useState(true);

  // Authentication & Role Check Routing
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else if (user.isTemporaryPassword) {
        router.push('/change-password');
      } else if (user.role !== 'Student') {
        router.push(`/${user.role.toLowerCase().replace(' ', '-')}`);
      }
    }
  }, [user, authLoading, router]);

  // Fetch Student Profile and Attendance
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [profileRes, attRes, finRes] = await Promise.all([
          api.get('/api/student/profile'),
          api.get('/api/student/attendance'),
          api.get('/api/student/finance').catch(e => ({ data: { data: { fees: [], fines: [] } } }))
        ]);
        if (isMounted) {
          if (!profileRes.data.data.course) {
            router.push('/complete-profile');
            return;
          }
          setProfileData(profileRes.data.data);
          setAttendanceSummary(attRes.data.data);
          setFinanceData(finRes.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
      if (isMounted) setLoadingData(false);
    };

    if (user && user.role === 'Student') {
      fetchData();
    }
    return () => { isMounted = false; };
  }, [api, user]);

  if (authLoading || !user || user.role !== 'Student' || loadingData) {
    return (
      <div className="min-h-screen bg-[#edf2f8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-black">Loading CampuSync Student Portal...</span>
        </div>
      </div>
    );
  }

  const studentName = user.name || 'Student';
  
  return (
    <div className="min-h-screen bg-[#dfe6f1] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-[1380px] bg-[#f2f5fa] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 flex flex-col md:flex-row overflow-hidden relative">
        
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
              <button onClick={() => setActiveSidebarTab('home')} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeSidebarTab === 'home' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Dashboard">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </button>
              <button onClick={() => setActiveSidebarTab('academics')} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeSidebarTab === 'academics' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Academics">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </button>
              <button onClick={() => setActiveSidebarTab('attendance')} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeSidebarTab === 'attendance' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Attendance">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </button>
              <button onClick={() => setActiveSidebarTab('fees')} className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer ${activeSidebarTab === 'fees' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-black hover:text-blue-600 hover:bg-gray-50'}`} title="Fees & Fines">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </nav>
          </div>
          
          <div className="flex md:flex-col items-center space-x-2 md:space-x-0 md:space-y-3 w-full">
            <button onClick={logout} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer" title="Logout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-sm cursor-pointer" title="Profile Settings">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm">
                {studentName.charAt(0)}
              </div>
            </div>
          </div>
        </aside>

        {/* ===================== MAIN CONTENT AREA ===================== */}
        <div className="flex-1 flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)] lg:h-[860px] overflow-hidden">
          
          {/* Header */}
          <header className="px-5 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f2f5fa] border-b border-gray-200/50 flex-shrink-0 z-20">
            <div>
              <h1 className="text-[22px] sm:text-2xl font-black text-black tracking-tight flex items-center gap-2">
                Hi, {studentName}
                <span className="text-xl">👋</span>
              </h1>
              <p className="text-xs sm:text-sm text-black mt-1 font-medium">
                {profileData?.course?.name || 'Student'} &bull; Sem {profileData?.currentSemester?.number || 'N/A'} &bull; Sec {profileData?.section?.name || 'N/A'}
              </p>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="px-4 py-2 sm:px-5 sm:py-2.5 bg-white text-black font-semibold text-xs sm:text-sm rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                <span>Enrolled</span>
              </div>
            </div>
          </header>

          {/* DASHBOARD BODY */}
          <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto scrollbar-hide">
            
            {activeSidebarTab === 'home' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 items-start">
                
                {/* Left 8-Columns (Primary Info) */}
                <div className="lg:col-span-8 flex flex-col gap-6 sm:gap-7">
                  
                  {/* Profile & Academic Info Card */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm relative overflow-hidden">
                    {/* Decorative Background Blur */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
                    
                    <h2 className="text-lg font-bold text-black mb-5 relative z-10">Academic Profile</h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Enrollment No.</p>
                        <p className="font-semibold text-black bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-100">{profileData?.enrollmentNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Course & Batch</p>
                        <p className="font-semibold text-black">{profileData?.course?.code} ({profileData?.batch?.name})</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Current Semester</p>
                        <p className="font-semibold text-black">Semester {profileData?.currentSemester?.number} &bull; {profileData?.section?.name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Contact Email</p>
                        <p className="font-medium text-black text-sm truncate">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Phone</p>
                        <p className="font-medium text-black text-sm">{profileData?.contactNumber || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-black uppercase tracking-wider mb-1">Guardian</p>
                        <p className="font-medium text-black text-sm">{profileData?.guardianName || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Schedule Placeholder */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-lg font-bold text-black">Today&apos;s Schedule</h2>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Phase 7 Preview</span>
                    </div>
                    <div className="bg-gray-50 border border-gray-100 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                      <svg className="w-10 h-10 text-black mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-sm font-bold text-black mb-1">Schedule Syncing...</h3>
                      <p className="text-xs text-black max-w-xs">Your timetable will appear here once the Academic Scheduling module is live.</p>
                    </div>
                  </div>
                </div>

                {/* Right 4-Columns (Secondary Info) */}
                <div className="lg:col-span-4 flex flex-col gap-6 sm:gap-7">
                  
                  {/* Overall Attendance Summary */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100/90 shadow-sm text-center relative overflow-hidden">
                    <h3 className="text-sm font-bold text-black text-left mb-6 relative z-10">Overall Attendance</h3>
                    
                    {/* Ring Chart */}
                    <div className="relative w-36 h-36 mx-auto mb-4 z-10">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                        <circle 
                          cx="50" cy="50" r="40" 
                          stroke={(attendanceSummary?.overall?.percentage || 0) < 75 ? '#ef4444' : '#10b981'} 
                          strokeWidth="12" 
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 - (251.2 * (attendanceSummary?.overall?.percentage || 0)) / 100} 
                          strokeLinecap="round" fill="none" 
                          className="drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)] transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-black tracking-tighter">
                          {attendanceSummary?.overall?.percentage || 0}<span className="text-lg">%</span>
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-black font-medium mb-1 z-10 relative">
                      {(attendanceSummary?.overall?.percentage || 0) >= 75 
                        ? 'Looks good! You are above 75%.' 
                        : 'Warning: Your attendance is below 75%.'}
                    </p>
                    <div className={`absolute top-0 right-0 -mt-8 -mr-8 w-24 h-24 rounded-full blur-2xl pointer-events-none ${(attendanceSummary?.overall?.percentage || 0) >= 75 ? 'bg-green-100/50' : 'bg-red-100/50'}`}></div>
                  </div>

                  {/* Fee Status (Placeholder) */}
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-7 shadow-lg shadow-indigo-600/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <h3 className="text-sm font-semibold text-indigo-100">Semester Fee</h3>
                      <span className="px-2 py-0.5 bg-green-400/20 text-green-300 border border-green-400/30 text-[10px] font-bold rounded uppercase tracking-wider">Paid</span>
                    </div>
                    <div className="relative z-10">
                      <p className="text-3xl font-black tracking-tight mb-1">₹ 45,000</p>
                      <p className="text-xs text-indigo-200 font-medium">No pending dues for this semester.</p>
                    </div>
                    <button className="mt-5 w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-semibold transition-colors relative z-10">
                      View Receipt
                    </button>
                  </div>

                </div>
              </div>
            )}

            {activeSidebarTab === 'academics' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-4">My Subjects</h2>
                <p className="text-black text-sm mb-6">Your subjects for Semester {profileData?.currentSemester?.number} will be listed here.</p>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3">Module Pending</span>
                  <p className="text-sm text-black max-w-sm">Subject enrollment tracking is scheduled for an upcoming development phase.</p>
                </div>
              </div>
            )}

            {activeSidebarTab === 'attendance' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6">Detailed Attendance</h2>
                
                {!attendanceSummary || !attendanceSummary.subjectWise || attendanceSummary.subjectWise.length === 0 ? (
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                    <p className="text-sm text-black">No attendance records found.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {attendanceSummary.subjectWise.map((stat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-black">{stat.subjectName}</p>
                          <p className="text-xs text-black">{stat.subjectCode}</p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-black">{stat.present} / {stat.total} Classes</p>
                            <p className="text-[10px] text-black uppercase tracking-wide">Attended</p>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-sm font-bold ${stat.percentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {stat.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSidebarTab === 'fees' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-black mb-6">Fee Structure & Fines</h2>
                
                {/* Fees Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-black mb-4">Your Fees</h3>
                  {financeData.fees?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Due Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {financeData.fees.map(fee => (
                            <tr key={fee._id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{fee.feeType}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">₹{fee.amount}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{new Date(fee.dueDate).toLocaleDateString()}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                                    fee.status === 'Partial' ? 'bg-yellow-100 text-yellow-800' : 
                                    'bg-red-100 text-red-800'}`}>
                                  {fee.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-black text-sm">No fees recorded.</p>
                  )}
                </div>

                {/* Fines Section */}
                <div>
                  <h3 className="text-lg font-semibold text-black mb-4">Your Fines</h3>
                  {financeData.fines?.length > 0 ? (
                    <div className="overflow-x-auto rounded-xl border border-gray-100">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Reason</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {financeData.fines.map(fine => (
                            <tr key={fine._id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{fine.reason}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-red-600">₹{fine.amount}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{new Date(fine.date).toLocaleDateString()}</td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                  ${fine.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {fine.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-black text-sm">No fines recorded. Great job!</p>
                  )}
                </div>
              </div>
            )}

          </main>

        </div>
      </div>
    </div>
  );
}
