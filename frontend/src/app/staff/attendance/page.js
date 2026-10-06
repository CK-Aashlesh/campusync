'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function StaffAttendance() {
  const { user, api, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Authentication check
  useEffect(() => {
    if (!authLoading) {
      if (!user || (user.role !== 'Staff' && user.role !== 'Admin')) {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  // Fetch subjects
  useEffect(() => {
    let isMounted = true;
    const fetchSubjects = async () => {
      try {
        const res = await api.get('/api/attendance/subjects');
        if (isMounted) {
          setSubjects(res.data.data);
          if (res.data.data.length > 0) {
            setSelectedSubject(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch subjects', err);
      }
    };
    if (user) {
      fetchSubjects();
    }
    return () => { isMounted = false; };
  }, [api, user]);

  // Fetch students when subject changes
  useEffect(() => {
    let isMounted = true;
    const fetchStudents = async () => {
      if (!selectedSubject) return;
      setLoadingData(true);
      try {
        const res = await api.get(`/api/attendance/students/${selectedSubject}`);
        if (isMounted) {
          setStudents(res.data.data);
          // Initialize all as Present
          const initialRecords = {};
          res.data.data.forEach(student => {
            initialRecords[student._id] = 'Present';
          });
          setAttendanceRecords(initialRecords);
          setSubmitMessage(null);
        }
      } catch (err) {
        console.error('Failed to fetch students', err);
      }
      if (isMounted) setLoadingData(false);
    };
    
    fetchStudents();
    return () => { isMounted = false; };
  }, [selectedSubject, api]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach(student => {
      updated[student._id] = status;
    });
    setAttendanceRecords(updated);
  };

  const handleSubmit = async () => {
    try {
      setSubmitMessage(null);
      const records = students.map(student => ({
        student: student._id,
        status: attendanceRecords[student._id]
      }));

      const payload = {
        subjectId: selectedSubject,
        date,
        timeSlot,
        records
      };

      const res = await api.post('/api/attendance', payload);
      setSubmitMessage({ type: 'success', text: res.data.message });
    } catch (error) {
      setSubmitMessage({ type: 'error', text: error.response?.data?.message || error.message });
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#edf2f8] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const staffName = user.name || 'Staff';

  return (
    <div className="min-h-screen bg-[#dfe6f1] p-2 sm:p-6 lg:p-8 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-[1380px] bg-[#f2f5fa] rounded-[24px] sm:rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* LEFT SIDEBAR (Matches Staff Page) */}
        <aside className="w-full md:w-[76px] bg-white border-b md:border-b-0 md:border-r border-gray-100/90 flex md:flex-col items-center justify-between p-3.5 md:py-6 flex-shrink-0 z-30">
          <div className="flex md:flex-col items-center space-x-3 md:space-x-0 md:space-y-6 w-full">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center shadow-md shadow-blue-500/25 tracking-tighter text-lg cursor-pointer transform hover:scale-105 transition-all">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="7" height="16" rx="2" fill="white" />
                <rect x="4" y="13" width="16" height="7" rx="2" fill="white" />
              </svg>
            </div>
            <nav className="flex md:flex-col items-center space-x-1 md:space-x-0 md:space-y-2.5 w-full px-1 md:px-2.5 overflow-x-auto md:overflow-visible">
              <Link href="/staff" className="w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer text-black hover:text-blue-600 hover:bg-gray-50" title="Dashboard">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
              </Link>
              <Link href="/staff/attendance" className="w-11 h-11 rounded-xl flex items-center justify-center transition-all cursor-pointer bg-blue-50 text-blue-600 shadow-sm" title="Attendance">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </Link>
            </nav>
          </div>
          <div className="flex md:flex-col items-center space-x-2 md:space-x-0 md:space-y-3 w-full">
            <button onClick={logout} className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition-colors" title="Logout">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
            </button>
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm">
                {staffName.charAt(0)}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col h-[calc(100vh-1rem)] sm:h-[calc(100vh-3rem)] lg:h-[860px] overflow-hidden">
          <header className="px-5 sm:px-8 py-5 sm:py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f2f5fa] border-b border-gray-200/50">
            <div>
              <h1 className="text-[22px] sm:text-2xl font-black text-black tracking-tight flex items-center gap-2">
                Mark Attendance
              </h1>
              <p className="text-xs sm:text-sm text-black mt-1 font-medium">Record daily attendance for your assigned subjects.</p>
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-7 lg:p-8 overflow-y-auto scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-6">
              
              {/* Configuration Panel */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Select Subject</label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value)}
                      className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    >
                      {subjects.length === 0 && <option value="">No subjects assigned</option>}
                      {subjects.map(sub => (
                        <option key={sub._id} value={sub._id}>
                          {sub.code} - {sub.name} (Sem {sub.semester?.number}, {sub.section?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-2">Time Slot (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Lecture 1, 09:30 AM"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {submitMessage && (
                <div className={`p-4 rounded-xl text-sm font-medium ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                  {submitMessage.text}
                </div>
              )}

              {/* Student Roster */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-lg font-bold text-black">Student List ({students.length})</h2>
                  {user.role === 'Staff' && (
                    <div className="flex space-x-2">
                      <button onClick={() => handleMarkAll('Present')} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors">Mark All Present</button>
                      <button onClick={() => handleMarkAll('Absent')} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors">Mark All Absent</button>
                    </div>
                  )}
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr className="text-left text-[11px] font-bold text-black uppercase tracking-wider">
                        <th className="py-3 px-6">Enrollment No.</th>
                        <th className="py-3 px-6">Student Name</th>
                        <th className="py-3 px-6">Attendance Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {loadingData ? (
                        <tr><td colSpan="3" className="py-8 text-center text-black text-sm">Loading students...</td></tr>
                      ) : students.length === 0 ? (
                        <tr><td colSpan="3" className="py-8 text-center text-black text-sm">No students found for this subject.</td></tr>
                      ) : (
                        students.map(student => (
                          <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 px-6 whitespace-nowrap text-sm font-medium text-black">{student.enrollmentNumber}</td>
                            <td className="py-3 px-6 whitespace-nowrap">
                              <div className="text-sm font-semibold text-black">{student.user?.name}</div>
                            </td>
                            <td className="py-3 px-6 whitespace-nowrap">
                              <div className="flex space-x-2">
                                {['Present', 'Absent', 'Late', 'Excused'].map(status => (
                                  <label key={status} className="inline-flex items-center cursor-pointer">
                                    <input
                                      type="radio"
                                      name={`status-${student._id}`}
                                      value={status}
                                      checked={attendanceRecords[student._id] === status}
                                      onChange={() => handleStatusChange(student._id, status)}
                                      disabled={user.role !== 'Staff'}
                                      className="sr-only" // hidden visually but accessible
                                    />
                                    <span className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors border ${
                                      attendanceRecords[student._id] === status
                                        ? status === 'Present' ? 'bg-green-100 border-green-200 text-green-700' 
                                          : status === 'Absent' ? 'bg-red-100 border-red-200 text-red-700'
                                          : status === 'Late' ? 'bg-amber-100 border-amber-200 text-amber-700'
                                          : 'bg-blue-100 border-blue-200 text-blue-700'
                                        : 'bg-white border-gray-200 text-black hover:bg-gray-50'
                                    }`}>
                                      {status}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {user.role === 'Staff' && (
                  <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                      onClick={handleSubmit}
                      disabled={students.length === 0}
                      className="px-6 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Save Attendance
                    </button>
                  </div>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

