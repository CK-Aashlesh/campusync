'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CompleteProfile() {
  const router = useRouter();
  const { user, api, loading: authLoading } = useAuth();
  const [academicData, setAcademicData] = useState({ courses: [], batches: [], semesters: [], sections: [] });
  const [formData, setFormData] = useState({
    course: '', batch: '', currentSemester: '', section: '',
    bloodGroup: '', dateOfBirth: '', address: '',
    guardianName: '', guardianContact: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auth and state check
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/login');
      else if (user.isTemporaryPassword) router.push('/change-password');
      else if (user.role !== 'Student') router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch Academic Data
  useEffect(() => {
    let isMounted = true;
    const fetchAcademicData = async () => {
      try {
        const [courseRes, batchRes, semRes, secRes] = await Promise.all([
          api.get('/api/academic/courses'),
          api.get('/api/academic/batches'),
          api.get('/api/academic/semesters'),
          api.get('/api/academic/sections')
        ]);
        if (isMounted) {
          setAcademicData({
            courses: courseRes.data.data,
            batches: batchRes.data.data,
            semesters: semRes.data.data,
            sections: secRes.data.data,
          });
        }
      } catch (err) {
        console.error('Failed to fetch academic data', err);
        setError('Could not load academic data. Please refresh.');
      }
    };
    if (user && user.role === 'Student') {
      fetchAcademicData();
    }
    return () => { isMounted = false; };
  }, [api, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.put('/api/student/profile', formData);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#edf2f8] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#dfe6f1] p-4 flex items-center justify-center font-sans antialiased">
      <div className="w-full max-w-4xl bg-[#f2f5fa] rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 overflow-hidden relative p-8 md:p-12">
        <h1 className="text-3xl font-black text-black tracking-tight mb-2">Complete Your Profile</h1>
        <p className="text-black font-medium mb-8">Please provide your academic and personal details to finish setting up your account.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/90">
            <h2 className="text-lg font-bold text-black mb-6">Academic Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Course / Program</label>
                <select name="course" required value={formData.course} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Course</option>
                  {academicData.courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Branch / Batch</label>
                <select name="batch" required value={formData.batch} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Batch</option>
                  {academicData.batches.filter(b => !formData.course || b.course?._id === formData.course || b.course === formData.course).map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Current Semester</label>
                <select name="currentSemester" required value={formData.currentSemester} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Semester</option>
                  {academicData.semesters.filter(s => !formData.batch || s.batch?._id === formData.batch || s.batch === formData.batch).map(s => <option key={s._id} value={s._id}>Sem {s.number}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Section</label>
                <select name="section" required value={formData.section} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Section</option>
                  {academicData.sections.filter(s => !formData.currentSemester || s.semester?._id === formData.currentSemester || s.semester === formData.currentSemester).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/90">
            <h2 className="text-lg font-bold text-black mb-6">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Blood Group</label>
                <select name="bloodGroup" required value={formData.bloodGroup} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Blood Group</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Date of Birth</label>
                <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Full residential address" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Guardian Name</label>
                <input type="text" name="guardianName" required value={formData.guardianName} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Guardian's Name" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Guardian Contact</label>
                <input type="text" name="guardianContact" required value={formData.guardianContact} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="Guardian's Phone" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Complete Profile & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
