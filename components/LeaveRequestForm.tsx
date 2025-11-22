import React, { useState, useEffect } from 'react';
import { Employee, LeaveType, LeaveStatus } from '../types';
import { validateLeaveRequest, submitLeaveRequest } from '../services/dataService';
import { LEAVE_RULES } from '../constants';
import { generateLeaveAnalysis } from '../services/geminiService';
import { AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

interface LeaveRequestFormProps {
  employees: Employee[];
  onSuccess: () => void;
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ employees, onSuccess }) => {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.ANNUAL);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const getDuration = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleAnalyze = async () => {
    if (!selectedEmployee || !reason || !startDate || !endDate) {
        setError("Mohon lengkapi data sebelum meminta analisis AI.");
        return;
    }
    setIsAnalyzing(true);
    const emp = employees.find(e => e.id === selectedEmployee);
    if (emp) {
        const duration = getDuration();
        const result = await generateLeaveAnalysis(emp.name, emp.role, leaveType, duration, reason, emp.annualLeaveUsed);
        setAiAnalysis(result);
    }
    setIsAnalyzing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!selectedEmployee) {
        setError("Pilih karyawan.");
        return;
    }

    const result = submitLeaveRequest(selectedEmployee, leaveType, startDate, endDate, reason);
    if (result.success) {
        onSuccess();
        setReason('');
        setStartDate('');
        setEndDate('');
        setAiAnalysis(null);
        alert('Pengajuan berhasil!');
    } else {
        setError(result.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Formulir Pengajuan Cuti</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 border border-red-200">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Karyawan</label>
            <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedEmployee}
                onChange={e => setSelectedEmployee(e.target.value)}
                required
            >
                <option value="">-- Pilih Karyawan --</option>
                {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} - {emp.role}</option>
                ))}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Cuti</label>
            <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={leaveType}
                onChange={e => setLeaveType(e.target.value as LeaveType)}
            >
                {Object.values(LeaveType).map(type => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Ketentuan: {LEAVE_RULES[leaveType].description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                <input 
                    type="date" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    required
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alasan Cuti</label>
            <textarea 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                required
                placeholder="Jelaskan alasan pengajuan..."
            />
        </div>

        {/* AI Section */}
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-indigo-800 font-medium">
                    <Sparkles size={16} />
                    <span>AI Assistant (Gemini)</span>
                </div>
                <button 
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="text-xs bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isAnalyzing ? 'Menganalisis...' : 'Cek Kelayakan'}
                </button>
            </div>
            {aiAnalysis && (
                <p className="text-sm text-indigo-700 italic">"{aiAnalysis}"</p>
            )}
        </div>

        <button 
            type="submit" 
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition mt-4"
        >
            Ajukan Cuti
        </button>
      </form>
    </div>
  );
};