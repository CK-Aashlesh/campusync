'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function MentorDashboard() {
  const { user, api, loading: authLoading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // States for reasons modal
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  const [certificateFile, setCertificateFile] = useState(null);
  const [submittingReason, setSubmittingReason] = useState(false);
  
  // View reasons state
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyReasons, setHistoryReasons] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'Staff') {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      try {
        setLoadingData(true);
        const res = await api.get('/api/mentor/students');
        
        // Let's fetch attendance summary for each assigned student
        const assignments = res.data.data;
        const studentsWithAtt = await Promise.all(assignments.map(async (assign) => {
          try {
            const attRes = await api.get(`/api/mentor/students/${assign.student._id}/attendance`);
            return {
              ...assign.student,
              attendance: attRes.data.data
            };
          } catch (e) {
            return {
              ...assign.student,
              attendance: { overallPercentage: 0, totalClasses: 0, presentClasses: 0 }
            };
          }
        }));
        setStudents(studentsWithAtt);
      } catch (error) {
        console.error('Error fetching assigned students:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (user && user.role === 'Staff') {
      fetchAssignedStudents();
    }
  }, [user, api]);

  const handleOpenReason = (student) => {
    setSelectedStudent(student);
    setReason('');
    setRemarks('');
    setCertificateFile(null);
    setShowReasonModal(true);
  };

  const handleSubmitReason = async (e) => {
    e.preventDefault();
    if (!reason || !selectedStudent) return;
    
    setSubmittingReason(true);
    try {
      const formData = new FormData();
      formData.append('attendancePercentage', selectedStudent.attendance.overallPercentage);
      formData.append('reason', reason);
      formData.append('remarks', remarks);
      if (certificateFile) {
        formData.append('certificate', certificateFile);
      }

      await api.post(`/api/mentor/students/${selectedStudent._id}/reason`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowReasonModal(false);
      alert('Reason added successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to add reason');
    } finally {
      setSubmittingReason(false);
    }
  };

  const handleOpenHistory = async (student) => {
    setSelectedStudent(student);
    setShowHistoryModal(true);
    setHistoryReasons([]);
    try {
      const res = await api.get(`/api/mentor/students/${student._id}/reasons`);
      setHistoryReasons(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load history');
    }
  };

  if (authLoading || loadingData) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Mentor Dashboard</h1>
        <Link href="/staff" className="text-blue-600 hover:underline">
          &larr; Back to Staff Dashboard
        </Link>
      </div>

      <p className="text-black mb-6">Students assigned to you for mentoring.</p>

      {students.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <p className="text-black">You currently have no students assigned.</p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Info</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Attendance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => {
                const isLow = student.attendance?.overallPercentage < 85;
                return (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-black">{student.user?.name}</div>
                      <div className="text-sm text-black">{student.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black">{student.course?.name} - {student.batch?.name}</div>
                      <div className="text-sm text-black">Sem {student.currentSemester?.number}, Sec {student.section?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${isLow ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {student.attendance?.overallPercentage}%
                      </span>
                      <div className="text-xs text-black mt-1">{student.attendance?.presentClasses} / {student.attendance?.totalClasses}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {isLow && (
                        <button onClick={() => handleOpenReason(student)} className="text-blue-600 hover:text-blue-900 mr-4">
                          Add Reason
                        </button>
                      )}
                      <button onClick={() => handleOpenHistory(student)} className="text-black hover:text-black">
                        View History
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add Shortage Reason</h2>
            <p className="text-sm text-black mb-4">Student: {selectedStudent?.user?.name} ({selectedStudent?.attendance?.overallPercentage}%)</p>
            <form onSubmit={handleSubmitReason}>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2">Reason</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Medical, Event, etc."
                />
              </div>
              <div className="mb-4">
                <label className="block text-black text-sm font-bold mb-2">Remarks</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-6">
                <label className="block text-black text-sm font-bold mb-2">Supporting Certificate (Optional)</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="w-full"
                  onChange={(e) => setCertificateFile(e.target.files[0])}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                  onClick={() => setShowReasonModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReason}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submittingReason ? 'Saving...' : 'Save Reason'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Reason History</h2>
            <p className="text-sm text-black mb-4">Student: {selectedStudent?.user?.name}</p>
            
            {historyReasons.length === 0 ? (
              <p className="text-black">No reasons recorded for this student.</p>
            ) : (
              <div className="space-y-4">
                {historyReasons.map(r => (
                  <div key={r._id} className="border p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-black">{r.reason}</span>
                      <span className="text-sm text-black">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-black mb-2">{r.remarks}</p>
                    <p className="text-xs text-black mb-2">At attendance: {r.attendancePercentage}%</p>
                    {r.certificateUrl && (
                      <a href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${r.certificateUrl}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm font-medium">
                        View Certificate
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
