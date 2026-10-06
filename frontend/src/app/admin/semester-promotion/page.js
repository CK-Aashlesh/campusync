'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SemesterPromotion() {
  const { api } = useAuth();
  const [view, setView] = useState('semesters'); // 'semesters' | 'branches' | 'students'
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleSemesterClick = async (semNumber) => {
    setSelectedSemester(semNumber);
    setView('branches');
    setLoading(true);
    try {
      const res = await api.get(`/api/admin/promotion-stats/${semNumber}`);
      setBranches(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching branch statistics');
    }
    setLoading(false);
  };

  const handleBranchClick = async (course) => {
    setSelectedCourse(course);
    setView('students');
    setLoading(true);
    setSelectedStudentIds(new Set());
    try {
      const res = await api.get(`/api/admin/promotion-students/${selectedSemester}/${course.courseId}`);
      setStudents(res.data.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching students');
    }
    setLoading(false);
  };

  const toggleStudent = (id) => {
    const newSet = new Set(selectedStudentIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedStudentIds(newSet);
  };

  const toggleAll = () => {
    if (selectedStudentIds.size === students.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(students.map(s => s._id)));
    }
  };

  const handlePromote = () => {
    if (selectedStudentIds.size === 0) return;
    setShowConfirm(true);
  };

  const confirmPromote = async () => {
    setProcessing(true);
    try {
      const payload = {
        studentIds: Array.from(selectedStudentIds),
        targetAction: selectedSemester === 8 ? 'graduate' : 'promote',
        currentSemesterNumber: selectedSemester
      };
      const res = await api.post('/api/admin/promote-selective', payload);
      alert(res.data.message);
      setShowConfirm(false);
      // Refresh students
      handleBranchClick(selectedCourse);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error processing promotion');
    }
    setProcessing(false);
  };

  return (
    <div className="p-5 sm:p-7 lg:p-8">
      {/* Header and Breadcrumbs */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-3">Semester Promotion</h1>
        <div className="flex items-center text-sm font-medium text-gray-500">
          <span 
            className={`cursor-pointer hover:text-blue-600 transition-colors ${view === 'semesters' ? 'text-black font-semibold' : ''}`}
            onClick={() => setView('semesters')}
          >
            Semester Promotion
          </span>
          {view !== 'semesters' && (
            <>
              <span className="mx-2">›</span>
              <span 
                className={`cursor-pointer hover:text-blue-600 transition-colors ${view === 'branches' ? 'text-black font-semibold' : ''}`}
                onClick={() => { setView('branches'); handleSemesterClick(selectedSemester); }}
              >
                {selectedSemester}{selectedSemester === 1 ? 'st' : selectedSemester === 2 ? 'nd' : selectedSemester === 3 ? 'rd' : 'th'} Semester
              </span>
            </>
          )}
          {view === 'students' && (
            <>
              <span className="mx-2">›</span>
              <span className="text-black font-semibold">{selectedCourse?.courseName}</span>
            </>
          )}
        </div>
      </div>

      {/* VIEW: SEMESTERS */}
      {view === 'semesters' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => handleSemesterClick(sem)}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {sem}
              </div>
              <span className="text-lg font-bold text-black group-hover:text-blue-600 transition-colors">
                {sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Semester
              </span>
            </button>
          ))}
        </div>
      )}

      {/* VIEW: BRANCHES */}
      {view === 'branches' && (
        <div>
          {loading ? (
            <p className="text-black">Loading branches...</p>
          ) : branches.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
              <p className="text-gray-500 font-medium">No active students found in the {selectedSemester}th Semester.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {branches.map(branch => (
                <button
                  key={branch.courseId}
                  onClick={() => handleBranchClick(branch)}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-gray-100 flex items-center justify-between group text-left"
                >
                  <div>
                    <h3 className="text-xl font-bold text-black group-hover:text-blue-600 transition-colors mb-1">
                      {branch.courseName}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {branch.studentCount} Active {branch.studentCount === 1 ? 'Student' : 'Students'}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW: STUDENTS */}
      {view === 'students' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[calc(100vh-280px)] sm:h-[500px]">
          {loading ? (
            <div className="p-8 text-black">Loading students...</div>
          ) : students.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-medium">No students found.</div>
          ) : (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 rounded-t-2xl">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={selectedStudentIds.size > 0 && selectedStudentIds.size === students.length}
                    ref={input => {
                      if (input) {
                        input.indeterminate = selectedStudentIds.size > 0 && selectedStudentIds.size < students.length;
                      }
                    }}
                    onChange={toggleAll}
                  />
                  <div>
                    <span className="font-semibold text-black group-hover:text-blue-600 transition-colors">Select All</span>
                    <span className="ml-2 text-sm text-gray-500 font-medium">({students.length} total)</span>
                  </div>
                </label>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-black bg-white px-3 py-1.5 rounded-lg border border-gray-200">
                    {selectedStudentIds.size} Selected
                  </span>
                  <button
                    onClick={handlePromote}
                    disabled={selectedStudentIds.size === 0}
                    className={`px-5 py-2 rounded-lg font-bold transition-all shadow-sm ${
                      selectedStudentIds.size > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedSemester === 8 ? 'Complete Graduation' : 'Promote Students'}
                  </button>
                </div>
              </div>

              {/* Table List */}
              <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white sticky top-0 shadow-sm z-10">
                    <tr className="text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                      <th className="p-4 font-bold w-[60px] text-center">Select</th>
                      <th className="p-4 font-bold w-[140px]">USN</th>
                      <th className="p-4 font-bold">Student Name</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {students.map(student => (
                      <tr 
                        key={student._id} 
                        className={`hover:bg-blue-50/30 transition-colors ${selectedStudentIds.has(student._id) ? 'bg-blue-50/50' : ''}`}
                        onClick={() => toggleStudent(student._id)}
                      >
                        <td className="p-4 text-center cursor-pointer" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            checked={selectedStudentIds.has(student._id)}
                            onChange={() => toggleStudent(student._id)}
                          />
                        </td>
                        <td className="p-4 font-bold text-black font-mono tracking-tight cursor-pointer">
                          {student.enrollmentNumber}
                        </td>
                        <td className="p-4 font-medium text-black cursor-pointer">
                          {student.user?.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-black mb-3 text-black">
              {selectedSemester === 8 ? 'Complete Graduation?' : 'Promote Students?'}
            </h2>
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
              <p className="text-black font-medium leading-relaxed">
                {selectedSemester === 8 ? (
                  <>You are about to mark <strong className="text-blue-700">{selectedStudentIds.size} students</strong> as having completed their 8th semester. This will move them out of the active semester progression and update their status to Graduated.</>
                ) : (
                  <>You are about to promote <strong className="text-blue-700">{selectedStudentIds.size} students</strong> from <strong className="text-blue-700">{selectedSemester}{selectedSemester === 1 ? 'st' : selectedSemester === 2 ? 'nd' : selectedSemester === 3 ? 'rd' : 'th'} Semester</strong> to <strong className="text-blue-700">{selectedSemester + 1}{selectedSemester + 1 === 2 ? 'nd' : selectedSemester + 1 === 3 ? 'rd' : 'th'} Semester</strong>.</>
                )}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={processing}
                className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmPromote}
                disabled={processing}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>{selectedSemester === 8 ? 'Confirm' : 'Confirm Promotion'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
