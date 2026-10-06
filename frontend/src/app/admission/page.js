'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function StudentManagement() {
  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', enrollmentNumber: '', contactNumber: '' });
  const [editId, setEditId] = useState(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admission/students');
      setStudentList(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, [api]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/admission/students/${editId}`, formData);
      } else {
        await api.post('/api/admission', formData);
      }
      setFormData({ name: '', email: '', enrollmentNumber: '', contactNumber: '' });
      setEditId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error saving student record');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.delete(`/api/admission/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert('Error toggling status');
    }
  };

  const resetPassword = async (student) => {
    if (confirm(`Are you sure you want to send a password reset email to ${student.user?.email}?`)) {
      try {
        await api.post(`/api/auth/forgot-password`, { email: student.user.email });
        alert('Password reset email sent successfully');
      } catch (err) {
        console.error(err);
        alert('Error sending password reset email');
      }
    }
  };

  const handleEdit = (student) => {
    setEditId(student._id);
    setFormData({
      enrollmentNumber: student.enrollmentNumber || '',
      contactNumber: student.contactNumber || ''
    });
  };

  return (
    <div className="p-5 sm:p-7 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Student Management</h1>
      
      <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Admit New Student</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Enrollment Number" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors">
              Admit Student
            </button>
          </div>
        </form>
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black border-b pb-2">Edit Student Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrollment Number</label>
                  <input className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Enrollment Number" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button type="button" onClick={() => { setEditId(null); setFormData({ name: '', email: '', enrollmentNumber: '', contactNumber: '' }); }} className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <h2 className="text-xl font-semibold p-6 border-b text-black">Admitted Students</h2>
        {loading ? (
          <p className="p-6 text-black">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-black uppercase tracking-wider text-xs">
                  <th className="p-4 font-semibold">Student</th>
                  <th className="p-4 font-semibold">Course & Batch</th>
                  <th className="p-4 font-semibold">Academic Location</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {studentList.map(student => (
                  <tr key={student._id} className="hover:bg-slate-50 transition-colors text-black">
                    <td className="p-4">
                      <div className="font-bold">{student.user?.name}</div>
                      <div className="text-xs">{student.enrollmentNumber} • {student.user?.email}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{student.course?.name || 'Not set'}</div>
                      <div className="text-xs">{student.batch?.name || ''}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">Sem {student.currentSemester?.number || '?'}, Sec {student.section?.name || '?'}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${student.user?.isActive !== false ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {student.user?.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(student)} className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => toggleStatus(student._id)} className="text-amber-600 font-semibold text-xs hover:underline cursor-pointer">
                        {student.user?.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => resetPassword(student)} className="text-red-600 font-semibold text-xs hover:underline cursor-pointer">Reset Pwd</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


