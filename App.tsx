import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { EmployeeForm } from './components/EmployeeForm';
import { LeaveRequestForm } from './components/LeaveRequestForm';
import { LeaveHistory } from './components/LeaveHistory';
import { getEmployees, getLeaveRequests, updateLeaveStatus, authenticateUser } from './services/dataService';
import { generateRejectionMessage } from './services/geminiService';
import { Employee, LeaveRequest, LeaveStatus, Role } from './types';
import { LayoutDashboard, UserPlus, FileText, ListChecks, X, Check, Menu, LogOut, Lock, History } from 'lucide-react';

enum View {
  DASHBOARD = 'dashboard',
  ADD_EMPLOYEE = 'add_employee',
  APPLY_LEAVE = 'apply_leave',
  APPROVAL = 'approval',
  HISTORY = 'history'
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const refreshData = () => {
    setEmployees(getEmployees());
    setRequests(getLeaveRequests());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = authenticateUser(loginData.username, loginData.password);
      if (user) {
          setCurrentUser(user);
          setIsLoggedIn(true);
          setLoginData({ username: '', password: '' });
      } else {
          alert("Username atau password salah!");
      }
  }

  const handleLogout = () => {
      setIsLoggedIn(false);
      setCurrentUser(null);
      setCurrentView(View.DASHBOARD);
  }

  const handleApprove = (id: string) => {
    if (window.confirm('Setujui cuti ini?')) {
        updateLeaveStatus(id, LeaveStatus.APPROVED);
        refreshData();
    }
  };

  const handleReject = async (req: LeaveRequest) => {
    const emp = employees.find(e => e.id === req.employeeId);
    if (!emp) return;

    const reason = prompt("Alasan penolakan:");
    if (reason) {
        // Use AI to refine the message
        const politeReason = await generateRejectionMessage(emp.name, reason);
        updateLeaveStatus(req.id, LeaveStatus.REJECTED, politeReason);
        refreshData();
        alert(`Cuti ditolak. Pesan terkirim: \n"${politeReason}"`);
    }
  };

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        currentView === view 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (!isLoggedIn) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-white/50">
                  <div className="text-center mb-8">
                      <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
                          <Lock className="text-white" size={32} />
                      </div>
                      <h1 className="text-2xl font-bold text-gray-800">HRM Cuti Pro</h1>
                      <p className="text-gray-500">Silahkan login untuk melanjutkan</p>
                      <div className="mt-4 bg-yellow-50 border border-yellow-100 p-3 rounded text-xs text-yellow-800 text-left">
                          <p className="font-bold">Demo Credentials:</p>
                          <p>HRD: admin / admin</p>
                          <p>Crew: budi / 123</p>
                      </div>
                  </div>
                  
                  <form onSubmit={handleLogin} className="space-y-5">
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <input 
                             type="text" 
                             required
                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                             placeholder="Masukkan username"
                             value={loginData.username}
                             onChange={e => setLoginData({...loginData, username: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                          <input 
                             type="password" 
                             required
                             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                             placeholder="Masukkan password"
                             value={loginData.password}
                             onChange={e => setLoginData({...loginData, password: e.target.value})}
                          />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/20"
                      >
                          Masuk Aplikasi
                      </button>
                  </form>
              </div>
          </div>
      )
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-blue-600">HRM Cuti Pro</h1>
          <p className="text-xs text-gray-500 mt-1">Welcome, {currentUser?.name}</p>
          <span className="inline-block mt-2 px-2 py-0.5 rounded bg-gray-100 text-xs font-bold text-gray-600">{currentUser?.role}</span>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          <NavItem view={View.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
          
          {/* Hanya HRD yang bisa tambah karyawan */}
          {currentUser?.role === Role.HRD && (
            <NavItem view={View.ADD_EMPLOYEE} icon={UserPlus} label="Tambah Karyawan" />
          )}
          
          <NavItem view={View.APPLY_LEAVE} icon={FileText} label="Ajukan Cuti" />
          
          {/* Hanya HRD yang bisa Approval */}
          {currentUser?.role === Role.HRD && (
            <NavItem view={View.APPROVAL} icon={ListChecks} label="Persetujuan Cuti" />
          )}

          <NavItem view={View.HISTORY} icon={History} label="Riwayat Cuti" />
        </nav>
        
        <div className="p-4 border-t border-gray-100">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile */}
        <header className="bg-white border-b border-gray-200 p-4 lg:hidden flex justify-between items-center sticky top-0 z-10">
          <h2 className="font-bold text-gray-800">HRM Cuti Pro</h2>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600">
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {currentView === View.DASHBOARD && (
            <Dashboard employees={employees} leaveRequests={requests} />
          )}
          
          {currentView === View.ADD_EMPLOYEE && (
            <EmployeeForm onSuccess={() => {
                refreshData();
                setCurrentView(View.DASHBOARD);
            }} />
          )}

          {currentView === View.APPLY_LEAVE && (
            <LeaveRequestForm employees={employees} onSuccess={() => {
                refreshData();
                // Jika HRD, ke Approval, jika user biasa kembali ke riwayat
                if (currentUser?.role === Role.HRD) {
                    setCurrentView(View.APPROVAL);
                } else {
                    setCurrentView(View.HISTORY);
                }
            }} />
          )}

          {currentView === View.HISTORY && (
            <LeaveHistory employees={employees} requests={requests} currentUser={currentUser} />
          )}

          {currentView === View.APPROVAL && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Daftar Pengajuan Cuti</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600 uppercase font-medium">
                        <tr>
                            <th className="px-6 py-4">Karyawan</th>
                            <th className="px-6 py-4">Jenis</th>
                            <th className="px-6 py-4">Tanggal</th>
                            <th className="px-6 py-4">Durasi</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {requests.filter(r => r.status === LeaveStatus.PENDING).length === 0 ? (
                             <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Tidak ada pengajuan baru yang perlu persetujuan.</td>
                             </tr>
                        ) : (
                            requests.filter(r => r.status === LeaveStatus.PENDING).map(req => {
                                const emp = employees.find(e => e.id === req.employeeId);
                                return (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{emp?.name}</div>
                                            <div className="text-xs text-gray-500">{emp?.role}</div>
                                        </td>
                                        <td className="px-6 py-4">{req.leaveType}</td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {req.startDate} s/d {req.endDate}
                                        </td>
                                        <td className="px-6 py-4">{req.durationDays} Hari</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 flex justify-center gap-2">
                                            {currentUser?.role === Role.HRD && (
                                                <>
                                                    <button 
                                                        onClick={() => handleApprove(req.id)}
                                                        className="p-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                                        title="Setujui"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleReject(req)}
                                                        className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                                                        title="Tolak"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}