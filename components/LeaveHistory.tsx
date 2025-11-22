import React, { useState, useMemo } from 'react';
import { Employee, LeaveRequest, LeaveStatus, Role } from '../types';
import { History, Filter, Search, Calendar, AlertCircle } from 'lucide-react';

interface LeaveHistoryProps {
  employees: Employee[];
  requests: LeaveRequest[];
  currentUser: Employee | null;
}

export const LeaveHistory: React.FC<LeaveHistoryProps> = ({ employees, requests, currentUser }) => {
  const [filterEmployeeId, setFilterEmployeeId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const isHRD = currentUser?.role === Role.HRD;

  const filteredRequests = useMemo(() => {
    let data = [...requests];

    // 1. Filter by User Role
    if (!isHRD && currentUser) {
      // Non-HRD only sees their own data
      data = data.filter(r => r.employeeId === currentUser.id);
    } else if (isHRD && filterEmployeeId) {
      // HRD filtering by specific employee
      data = data.filter(r => r.employeeId === filterEmployeeId);
    }

    // 2. Filter by Status
    if (filterStatus !== 'ALL') {
      data = data.filter(r => r.status === filterStatus);
    }

    // 3. Sort by Date (Newest First)
    return data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [requests, currentUser, isHRD, filterEmployeeId, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <History className="text-blue-600" />
                Riwayat Pengajuan Cuti
            </h2>
            <p className="text-sm text-gray-500 mt-1">
                {isHRD 
                    ? 'Pantau semua riwayat pengajuan cuti karyawan.' 
                    : 'Pantau status dan riwayat pengajuan cuti Anda.'}
            </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        {isHRD && (
            <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Filter Karyawan</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <select 
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        value={filterEmployeeId}
                        onChange={(e) => setFilterEmployeeId(e.target.value)}
                    >
                        <option value="">Semua Karyawan</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                        ))}
                    </select>
                </div>
            </div>
        )}

        <div className="w-full md:w-64">
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Filter Status</label>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <select 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="ALL">Semua Status</option>
                    {Object.values(LeaveStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-600">Tanggal Pengajuan</th>
                        {isHRD && <th className="px-6 py-4 font-semibold text-gray-600">Nama Karyawan</th>}
                        <th className="px-6 py-4 font-semibold text-gray-600">Jenis Cuti</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Durasi</th>
                        <th className="px-6 py-4 font-semibold text-gray-600">Alasan & Catatan</th>
                        <th className="px-6 py-4 font-semibold text-gray-600 text-center">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredRequests.length === 0 ? (
                        <tr>
                            <td colSpan={isHRD ? 6 : 5} className="px-6 py-12 text-center text-gray-400">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <Calendar size={32} className="opacity-20" />
                                    <span>Tidak ada data riwayat cuti ditemukan.</span>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredRequests.map((req) => {
                            const emp = employees.find(e => e.id === req.employeeId);
                            const isRejected = req.status === LeaveStatus.REJECTED;
                            
                            return (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                        <div className="font-medium text-gray-900">
                                            {new Date(req.startDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs">s/d {new Date(req.endDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                    </td>
                                    {isHRD && (
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{emp?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{emp?.role}</div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {req.leaveType}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {req.durationDays} Hari
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="text-gray-800 truncate" title={req.reason}>"{req.reason}"</p>
                                        {isRejected && req.rejectionReason && (
                                            <div className="mt-1 flex items-start gap-1 text-xs text-red-600 bg-red-50 p-2 rounded">
                                                <AlertCircle size={12} className="mt-0.5 flex-shrink-0" />
                                                <span>HRD: {req.rejectionReason}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                            req.status === LeaveStatus.APPROVED ? 'bg-green-100 text-green-700 border border-green-200' :
                                            req.status === LeaveStatus.REJECTED ? 'bg-red-100 text-red-700 border border-red-200' :
                                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                        }`}>
                                            {req.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};