'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

export default function FinanceDashboard() {
  const { user, api, loading: authLoading } = useAuth();
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hierarchy State
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  // Amounts State: { [studentId]: string }
  const [amounts, setAmounts] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'Finance') {
        router.push('/login');
      } else {
        fetchStudents();
      }
    }
  }, [user, authLoading, router]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Re-use the existing admission endpoint which has been authorized for Finance
      const res = await api.get('/api/admission/students');
      setStudents(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch students', err);
    }
    setLoading(false);
  };

  // Derive available semesters from the student data
  const availableSemesters = useMemo(() => {
    const sems = new Set();
    students.forEach(s => {
      if (s.currentSemester?.number) {
        sems.add(s.currentSemester.number);
      }
    });
    return Array.from(sems).sort((a, b) => a - b);
  }, [students]);

  // All Semesters (1 to 8) as requested
  const ALL_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

  // Derive available branches for the selected semester
  const availableBranches = useMemo(() => {
    if (!selectedSemester) return [];
    
    const branchMap = new Map();
    students.forEach(s => {
      if (s.currentSemester?.number === selectedSemester && s.course) {
        if (!branchMap.has(s.course._id)) {
          branchMap.set(s.course._id, s.course.code || s.course.name);
        }
      }
    });
    
    return Array.from(branchMap.entries()).map(([id, name]) => ({ id, name }));
  }, [students, selectedSemester]);

  // Derive the final student list for the table
  const filteredStudents = useMemo(() => {
    if (!selectedSemester || !selectedBranch) return [];
    
    const filtered = students.filter(
      s => s.currentSemester?.number === selectedSemester && s.course?._id === selectedBranch.id
    );
    
    // Sort by USN (enrollmentNumber) ascending
    return filtered.sort((a, b) => {
      const usnA = a.enrollmentNumber || '';
      const usnB = b.enrollmentNumber || '';
      return usnA.localeCompare(usnB);
    });
  }, [students, selectedSemester, selectedBranch]);

  const handleAmountChange = (studentId, val) => {
    setAmounts(prev => ({ ...prev, [studentId]: val }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let savedCount = 0;
      for (const student of filteredStudents) {
        const amt = amounts[student._id];
        if (amt && !isNaN(amt) && Number(amt) > 0) {
          // Modular approach: we create a basic Fee record.
          // This can be expanded later when fee histories/receipts are implemented.
          await api.post('/api/finance/fees', {
            studentId: student._id,
            feeType: 'Semester Fee',
            amount: Number(amt),
            dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1))
          });
          savedCount++;
        }
      }
      alert(`Successfully saved fees for ${savedCount} student(s).`);
      // Clear amounts after saving
      setAmounts({});
    } catch (err) {
      console.error(err);
      alert('Error saving fees. Please try again.');
    }
    setSaving(false);
  };

  if (loading || authLoading) {
    return <div className="p-8 text-center text-lg text-black">Loading Finance Data...</div>;
  }

  return (
    <div className="p-4 sm:p-8 w-full max-w-7xl mx-auto text-black">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
          <p className="text-gray-500 mt-1">Manage semester fees and student accounts</p>
        </div>
      </div>

      {/* Step 1: Semesters */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">1. Select Semester</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {ALL_SEMESTERS.map(sem => {
            const hasStudents = availableSemesters.includes(sem);
            const isSelected = selectedSemester === sem;
            
            return (
              <button
                key={sem}
                disabled={!hasStudents}
                onClick={() => {
                  setSelectedSemester(sem);
                  setSelectedBranch(null);
                  setAmounts({});
                }}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : hasStudents
                    ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                {sem}{sem === 1 ? 'st' : sem === 2 ? 'nd' : sem === 3 ? 'rd' : 'th'} Sem
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Branches */}
      {selectedSemester && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">2. Select Branch</h2>
          {availableBranches.length === 0 ? (
            <p className="text-gray-500 italic">No branches found with students in this semester.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {availableBranches.map(branch => {
                const isSelected = selectedBranch?.id === branch.id;
                return (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setAmounts({});
                    }}
                    className={`py-2.5 px-6 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                    }`}
                  >
                    {branch.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Students Table */}
      {selectedBranch && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                3. Student Fees
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredStudents.length} students in {selectedBranch.name}, Semester {selectedSemester}
              </p>
            </div>
            
            {filteredStudents.length > 0 && (
              <button
                onClick={handleSave}
                disabled={saving || Object.keys(amounts).length === 0}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  saving || Object.keys(amounts).length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                }`}
              >
                {saving ? 'Saving...' : 'Save Entered Amounts'}
              </button>
            )}
          </div>
          
          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500 italic">No students found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                    <th className="p-4 pl-6">USN</th>
                    <th className="p-4">Student Name</th>
                    <th className="p-4 pr-6 w-48">Amount (?)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="p-4 pl-6 font-mono text-sm font-medium text-gray-700">
                        {student.enrollmentNumber}
                      </td>
                      <td className="p-4 text-sm text-gray-900 font-medium">
                        {student.user?.name || 'Unknown User'}
                      </td>
                      <td className="p-4 pr-6">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 font-medium">?</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={amounts[student._id] || ''}
                            onChange={(e) => handleAmountChange(student._id, e.target.value)}
                            className="block w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-gray-900 font-medium"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
