import React, { useState } from 'react';
import { Role } from '../types';
import { addEmployee } from '../services/dataService';
import { UserPlus, Lock, User } from 'lucide-react';

interface EmployeeFormProps {
  onSuccess: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: Role.CREW,
    storeId: '',
    areaId: '',
    joinDate: '',
    username: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addEmployee(formData);
    setFormData({
        name: '',
        role: Role.CREW,
        storeId: '',
        areaId: '',
        joinDate: '',
        username: '',
        password: '',
    });
    onSuccess();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <UserPlus className="text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">Tambah Karyawan Baru</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
          <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
             <Lock size={14} /> Akun Login
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Username</label>
                <input
                    required
                    type="text"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                    required
                    type="password"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                />
             </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            required
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
            >
              {Object.values(Role).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Masuk</label>
            <input
              required
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={formData.joinDate}
              onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store ID (Khusus Crew/SPV)</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: ST-001"
              value={formData.storeId}
              onChange={e => setFormData({ ...formData, storeId: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area ID</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: AREA-JAVA"
              value={formData.areaId}
              onChange={e => setFormData({ ...formData, areaId: e.target.value })}
            />
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Simpan Data Karyawan
          </button>
        </div>
      </form>
    </div>
  );
};