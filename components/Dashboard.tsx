import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Employee, LeaveRequest, LeaveStatus, LeaveType } from '../types';
import { Users, CalendarClock, CheckCircle, XCircle, Calculator } from 'lucide-react';

interface DashboardProps {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const Dashboard: React.FC<DashboardProps> = ({ employees, leaveRequests }) => {
  
  const stats = useMemo(() => {
    return {
      totalEmployees: employees.length,
      pendingRequests: leaveRequests.filter(r => r.status === LeaveStatus.PENDING).length,
      approvedThisMonth: leaveRequests.filter(r => r.status === LeaveStatus.APPROVED).length,
      rejectedRequests: leaveRequests.filter(r => r.status === LeaveStatus.REJECTED).length,
    };
  }, [employees, leaveRequests]);

  const roleDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    employees.forEach(e => {
        dist[e.role] = (dist[e.role] || 0) + 1;
    });
    return Object.keys(dist).map(key => ({ name: key, value: dist[key] }));
  }, [employees]);

  const leaveTypeStats = useMemo(() => {
    const dist: Record<string, number> = {};
    leaveRequests.forEach(r => {
        dist[r.leaveType] = (dist[r.leaveType] || 0) + 1;
    });
    return Object.keys(dist).map(key => ({ name: key, count: dist[key] }));
  }, [leaveRequests]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Cuti</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Karyawan</p>
            <h3 className="text-xl font-bold">{stats.totalEmployees}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <CalendarClock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Menunggu Persetujuan</p>
            <h3 className="text-xl font-bold">{stats.pendingRequests}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Cuti Disetujui</p>
            <h3 className="text-xl font-bold">{stats.approvedThisMonth}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Ditolak</p>
            <h3 className="text-xl font-bold">{stats.rejectedRequests}</h3>
          </div>
        </div>
      </div>

      {/* Sisa Cuti Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
         <div className="p-5 border-b border-gray-100 flex items-center gap-2">
            <Calculator className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">Monitoring Sisa Cuti Tahunan Karyawan</h3>
         </div>
         <div className="overflow-x-auto max-h-64 overflow-y-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                        <th className="px-6 py-3 font-medium text-gray-600">Nama Karyawan</th>
                        <th className="px-6 py-3 font-medium text-gray-600">Jabatan</th>
                        <th className="px-6 py-3 font-medium text-gray-600">Lokasi (Store/Area)</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-center">Jatah</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-center">Terpakai</th>
                        <th className="px-6 py-3 font-medium text-gray-600 text-center">Sisa</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {employees.map(emp => {
                        const maxAnnual = 12;
                        const remaining = maxAnnual - emp.annualLeaveUsed;
                        const location = emp.storeId ? `Store: ${emp.storeId}` : (emp.areaId ? `Area: ${emp.areaId}` : 'HQ');
                        
                        return (
                            <tr key={emp.id} className="hover:bg-gray-50">
                                <td className="px-6 py-3 font-medium text-gray-900">{emp.name}</td>
                                <td className="px-6 py-3 text-gray-600">{emp.role}</td>
                                <td className="px-6 py-3 text-gray-500">{location}</td>
                                <td className="px-6 py-3 text-center text-gray-500">{maxAnnual}</td>
                                <td className="px-6 py-3 text-center text-red-500 font-semibold">{emp.annualLeaveUsed}</td>
                                <td className="px-6 py-3 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        remaining > 5 ? 'bg-green-100 text-green-700' : 
                                        remaining > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                        {remaining} Hari
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
         </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Distribusi Karyawan per Level</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4">Statistik Jenis Cuti</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveTypeStats}>
                <XAxis dataKey="name" hide />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Jumlah Pengajuan" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};