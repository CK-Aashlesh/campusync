'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/admin/audit-logs');
      setLogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [api]);

  return (
    <div className="p-5 sm:p-7 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-black">Audit / Activity Logs</h1>
        <button onClick={fetchLogs} className="bg-white border border-gray-200 text-black px-4 py-2 rounded-lg font-semibold shadow-sm hover:bg-gray-50 transition-colors">
          Refresh
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-black">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr className="text-black uppercase tracking-wider text-xs border-b border-gray-100">
                  <th className="p-4 font-semibold">Timestamp</th>
                  <th className="p-4 font-semibold">User / Actor</th>
                  <th className="p-4 font-semibold">Action</th>
                  <th className="p-4 font-semibold">Details</th>
                  <th className="p-4 font-semibold text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-gray-500 font-medium">No audit logs found.</td>
                  </tr>
                )}
                {logs.map(log => (
                  <tr key={log._id} className="hover:bg-slate-50 transition-colors text-black">
                    <td className="p-4 whitespace-nowrap text-xs font-medium text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="font-bold">{log.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">{log.user?.role || 'System'}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-gray-100 font-mono text-xs font-semibold">{log.action}</span>
                    </td>
                    <td className="p-4 text-sm">{log.details}</td>
                    <td className="p-4 text-right text-xs text-gray-400 font-mono">{log.ipAddress || '-'}</td>
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
