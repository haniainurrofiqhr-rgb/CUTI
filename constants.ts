import { LeaveType, Role } from './types';

export const LEAVE_RULES: Record<LeaveType, { maxDays: number; description: string }> = {
  [LeaveType.ANNUAL]: { maxDays: 12, description: 'Maksimal 12 hari setahun' },
  [LeaveType.MATERNITY]: { maxDays: 90, description: '3 Bulan' },
  [LeaveType.MISCARRIAGE]: { maxDays: 45, description: '1.5 Bulan' },
  [LeaveType.SICK]: { maxDays: 365, description: 'Sesuai Ketentuan Dokter' },
  [LeaveType.MENSTRUATION]: { maxDays: 2, description: '2 Hari per siklus' },
  [LeaveType.MARRIAGE]: { maxDays: 3, description: '3 Hari' },
  [LeaveType.CHILD_MARRIAGE]: { maxDays: 2, description: '2 Hari' },
  [LeaveType.CIRCUMCISION_BAPTISM]: { maxDays: 2, description: '2 Hari' },
  [LeaveType.DEATH_CORE]: { maxDays: 2, description: '2 Hari (Keluarga Inti)' },
  [LeaveType.DEATH_HOUSE]: { maxDays: 1, description: '1 Hari (Serumah)' },
};

// Mock Data Initialization dengan Username & Password
// Default password untuk demo: "123456"
export const INITIAL_EMPLOYEES = [
  { id: '1', name: 'Budi Santoso', role: Role.CREW, storeId: 'STORE-001', areaId: 'AREA-01', joinDate: '2022-01-15', annualLeaveUsed: 2, username: 'budi', password: '123' },
  { id: '2', name: 'Siti Aminah', role: Role.CREW, storeId: 'STORE-001', areaId: 'AREA-01', joinDate: '2022-03-10', annualLeaveUsed: 5, username: 'siti', password: '123' },
  { id: '3', name: 'Andi Wijaya', role: Role.SPV, storeId: 'STORE-001', areaId: 'AREA-01', joinDate: '2020-05-20', annualLeaveUsed: 0, username: 'andi', password: '123' },
  { id: '4', name: 'Rina Marlina', role: Role.SPV, storeId: 'STORE-002', areaId: 'AREA-01', joinDate: '2021-02-01', annualLeaveUsed: 1, username: 'rina', password: '123' },
  { id: '5', name: 'Doni Tata', role: Role.AM, storeId: '', areaId: 'AREA-01', joinDate: '2019-08-15', annualLeaveUsed: 8, username: 'doni', password: '123' },
  { id: '6', name: 'Eko Prasetyo', role: Role.AM, storeId: '', areaId: 'AREA-02', joinDate: '2018-11-01', annualLeaveUsed: 4, username: 'eko', password: '123' },
  { id: '7', name: 'Mega Putri', role: Role.HRD, storeId: '', areaId: '', joinDate: '2015-01-01', annualLeaveUsed: 0, username: 'admin', password: 'admin' },
];