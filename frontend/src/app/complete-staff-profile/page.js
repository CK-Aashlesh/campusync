'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CompleteStaffProfile() {
  const router = useRouter();
  const { user, api, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    bloodGroup: '',
    gender: '',
    address: '',
    contactNumber: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auth check
  useEffect(() => {
    if (!authLoading) {
      if (!user) router.push('/login');
      else if (user.isTemporaryPassword) router.push('/change-password');
      else if (['Student', 'Admin'].includes(user.role)) router.push('/');
    }
  }, [user, authLoading, router]);

  const handleChange = (e) => {
    if (e.target.name === 'profilePhoto') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) data.append(key, formData[key]);
      });

      await api.put('/api/staff/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const role = user.role;
      if (role === 'Student') {
        router.push('/');
      } else {
        router.push(`/${role.toLowerCase().replace(' ', '-')}`);
      }
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
      <div className="w-full max-w-3xl bg-[#f2f5fa] rounded-[32px] shadow-[0_25px_70px_-15px_rgba(20,40,90,0.18)] border border-white/70 overflow-hidden relative p-8 md:p-12">
        <h1 className="text-3xl font-black text-black tracking-tight mb-2">Complete Your Profile</h1>
        <p className="text-black font-medium mb-8">Please provide your personal details to finish setting up your staff account.</p>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100/90">
            <h2 className="text-lg font-bold text-black mb-6">Personal Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Date of Birth</label>
                <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black" />
              </div>

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
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Gender</label>
                <select name="gender" required value={formData.gender} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black">
                  <option value="">Select Gender</option>
                  {['Male', 'Female', 'Other'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Contact Number</label>
                <input type="text" name="contactNumber" required value={formData.contactNumber} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black" placeholder="Contact Number" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Address</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black" placeholder="Full residential address" />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-black uppercase tracking-wider mb-1.5">Profile Photo (Optional)</label>
                <input type="file" name="profilePhoto" accept="image/*" className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black" />
                <p className="text-xs text-gray-500 mt-1">You can upload a profile photo (Not mandatory).</p>
              </div>

            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Complete Profile & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
