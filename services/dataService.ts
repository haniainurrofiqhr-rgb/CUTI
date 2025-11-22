import { Employee, LeaveRequest, LeaveType, Role, ConflictResult, LeaveStatus } from '../types';
import { LEAVE_RULES, INITIAL_EMPLOYEES } from '../constants';

// In-memory storage for demo purposes (simulating DB)
let employees: Employee[] = [...INITIAL_EMPLOYEES] as any;
let leaveRequests: LeaveRequest[] = [];

// Helper: Date overlap check
const datesOverlap = (startA: string, endA: string, startB: string, endB: string): boolean => {
  return (startA <= endB) && (endA >= startB);
};

export const getEmployees = () => [...employees];

export const authenticateUser = (username: string, password: string): Employee | null => {
  const user = employees.find(e => e.username === username && e.password === password);
  return user || null;
};

export const addEmployee = (emp: Omit<Employee, 'id' | 'annualLeaveUsed'>) => {
  const newEmp: Employee = {
    ...emp,
    id: Date.now().toString(),
    annualLeaveUsed: 0
  };
  employees.push(newEmp);
  return newEmp;
};

export const getLeaveRequests = () => [...leaveRequests];

export const validateLeaveRequest = (
  employeeId: string,
  leaveType: LeaveType,
  startDate: string,
  endDate: string
): ConflictResult => {
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return { hasConflict: true, message: 'Karyawan tidak ditemukan.' };

  // 1. Check Duration Rules
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const rule = LEAVE_RULES[leaveType];
  if (duration > rule.maxDays) {
    return { hasConflict: true, message: `Durasi melebihi batas ${rule.description}.` };
  }

  // 2. Check Annual Leave Quota
  if (leaveType === LeaveType.ANNUAL) {
    if (employee.annualLeaveUsed + duration > LEAVE_RULES[LeaveType.ANNUAL].maxDays) {
        return { hasConflict: true, message: `Sisa cuti tahunan tidak mencukupi. Sisa: ${12 - employee.annualLeaveUsed}` };
    }
  }

  // 3. Business Logic Conflicts (Overlap Check with APPROVED leaves only)
  const approvedLeaves = leaveRequests.filter(req => 
    req.status === LeaveStatus.APPROVED && 
    req.employeeId !== employeeId && // Don't check self
    datesOverlap(req.startDate, req.endDate, startDate, endDate)
  );

  for (const leave of approvedLeaves) {
    const otherEmp = employees.find(e => e.id === leave.employeeId);
    if (!otherEmp) continue;

    // Rule A: Crew Store - Same Store Conflict
    // "cuti bersamaan di store yang sama ditolak"
    if (employee.role === Role.CREW && otherEmp.role === Role.CREW) {
      if (employee.storeId === otherEmp.storeId) {
        return { hasConflict: true, message: `BLOKIR: Bentrok jadwal dengan ${otherEmp.name} di Store ${employee.storeId}.` };
      }
    }

    // Rule B: Supervisor - Same Area Conflict
    // "cuti bersamaan di area yang sama untuk supervisor di tolak"
    if (employee.role === Role.SPV && otherEmp.role === Role.SPV) {
      if (employee.areaId === otherEmp.areaId) {
        return { hasConflict: true, message: `BLOKIR: Bentrok jadwal dengan SPV ${otherEmp.name} di Area ${employee.areaId}.` };
      }
    }

    // Rule C: Area Manager - Overlap Conflict
    // "cuti Area Manager bersamaan ditolak" (Asumsi: AM tidak boleh bareng dengan AM lain manapun, atau bisa dipersempit ke wilayah jika ada struktur regional)
    // Di sini kita terapkan rule ketat: Sesama AM tidak boleh cuti bareng.
    if (employee.role === Role.AM && otherEmp.role === Role.AM) {
      return { hasConflict: true, message: `BLOKIR: Bentrok jadwal dengan Area Manager ${otherEmp.name}.` };
    }
  }

  return { hasConflict: false, message: 'Valid' };
};

export const submitLeaveRequest = (
  employeeId: string,
  leaveType: LeaveType,
  startDate: string,
  endDate: string,
  reason: string
): { success: boolean; message: string } => {
  const validation = validateLeaveRequest(employeeId, leaveType, startDate, endDate);
  if (validation.hasConflict) {
    return { success: false, message: validation.message };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const newRequest: LeaveRequest = {
    id: Date.now().toString(),
    employeeId,
    leaveType,
    startDate,
    endDate,
    durationDays: duration,
    reason,
    status: LeaveStatus.PENDING
  };

  leaveRequests.push(newRequest);
  return { success: true, message: 'Pengajuan berhasil dikirim.' };
};

export const updateLeaveStatus = (requestId: string, status: LeaveStatus, rejectReason?: string) => {
    const reqIndex = leaveRequests.findIndex(r => r.id === requestId);
    if (reqIndex === -1) return;

    const request = leaveRequests[reqIndex];
    
    // If approving an annual leave, deduct quota
    if (status === LeaveStatus.APPROVED && request.status !== LeaveStatus.APPROVED) {
        const empIndex = employees.findIndex(e => e.id === request.employeeId);
        if (empIndex !== -1 && request.leaveType === LeaveType.ANNUAL) {
            employees[empIndex].annualLeaveUsed += request.durationDays;
        }
    }

    leaveRequests[reqIndex] = {
        ...request,
        status,
        rejectionReason: rejectReason
    };
};