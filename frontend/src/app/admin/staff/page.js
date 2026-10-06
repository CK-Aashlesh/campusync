'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function StaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();
  
  const [formData, setFormData] = useState({ name: '', email: '', employeeId: '', department: '', designation: '', contactNumber: '', role: 'Staff' });
  const [editId, setEditId] = useState(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/staff');
      setStaffList(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, [api]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/api/staff/${editId}`, formData);
      } else {
        await api.post('/api/staff', formData);
      }
      setFormData({ name: '', email: '', employeeId: '', department: '', designation: '', contactNumber: '', role: 'Staff' });
      setEditId(null);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert('Error saving staff record');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.delete(`/api/staff/${id}`);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert('Error toggling status');
    }
  };

  const resetPassword = async (staff) => {
    if (confirm(`Are you sure you want to send a password reset email to ${staff.user?.email}?`)) {
      try {
        await api.post(`/api/auth/forgot-password`, { email: staff.user.email });
        alert('Password reset email sent successfully');
      } catch (err) {
        console.error(err);
        alert('Error sending password reset email');
      }
    }
  };

  const handleEdit = (staff) => {
    setEditId(staff._id);
    setFormData({
      name: staff.user?.name || '',
      email: staff.user?.email || '',
      employeeId: staff.employeeId || '',
      department: staff.department || '',
      designation: staff.designation || '',
      contactNumber: staff.contactNumber || '',
      role: staff.user?.role || 'Staff'
    });
  };

  return (
    <div className="p-5 sm:p-7 lg:p-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Staff Management</h1>
      
      <div className="bg-white p-6 rounded-lg mb-8 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Add New Staff</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Department" name="department" value={formData.department} onChange={handleChange} required />
            <select className="border p-2 rounded text-black bg-white" name="role" value={formData.role} onChange={handleChange} required>
              <option value="Staff">Teaching Staff</option>
              <option value="Admission">Admission Officer</option>
              <option value="Finance">Finance Officer</option>
            </select>
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Designation" name="designation" value={formData.designation} onChange={handleChange} />
            <input className="border p-2 rounded text-black placeholder-black" placeholder="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition-colors">
              Add Staff
            </button>
          </div>
        </form>
      </div>

      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-black border-b pb-2">Edit Staff</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Department" name="department" value={formData.department} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" name="role" value={formData.role} onChange={handleChange} required>
                    <option value="Staff">Teaching Staff</option>
                    <option value="Admission">Admission Officer</option>
                    <option value="Finance">Finance Officer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <input className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                  <input className="w-full border p-2.5 rounded-lg text-black bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Contact Number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button type="button" onClick={() => { setEditId(null); setFormData({ name: '', email: '', employeeId: '', department: '', designation: '', contactNumber: '', role: 'Staff' }); }} className="bg-gray-100 text-gray-800 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
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
        <h2 className="text-xl font-semibold p-6 border-b text-black">Existing Staff</h2>
        {loading ? (
          <p className="p-6 text-black">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-black uppercase tracking-wider text-xs">
                  <th className="p-4 font-semibold">Employee</th>
                  <th className="p-4 font-semibold">Department</th>
                  <th className="p-4 font-semibold">Designation</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {staffList.map(staff => (
                  <tr key={staff._id} className="hover:bg-slate-50 transition-colors text-black">
                    <td className="p-4">
                      <div className="font-bold">{staff.user?.name}</div>
                      <div className="text-xs">{staff.employeeId} • {staff.user?.email}</div>
                    </td>
                    <td className="p-4 font-medium">{staff.department}</td>
                    <td className="p-4 text-xs">{staff.designation}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${staff.user?.isActive !== false ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                        {staff.user?.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => handleEdit(staff)} className="text-blue-600 font-semibold text-xs hover:underline cursor-pointer">Edit</button>
                      <button onClick={() => toggleStatus(staff._id)} className="text-amber-600 font-semibold text-xs hover:underline cursor-pointer">
                        {staff.user?.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => resetPassword(staff)} className="text-red-600 font-semibold text-xs hover:underline cursor-pointer">Reset Pwd</button>
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


