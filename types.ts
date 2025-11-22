export enum Role {
  CREW = 'Crew Store',
  SPV = 'Supervisor',
  AM = 'Area Manager',
  OM = 'Operasional Manager',
  HRD = 'HRD'
}

export enum LeaveType {
  ANNUAL = 'Tahunan',
  MATERNITY = 'Melahirkan',
  MISCARRIAGE = 'Keguguran',
  SICK = 'Sakit',
  MENSTRUATION = 'Haid',
  MARRIAGE = 'Menikah',
  CHILD_MARRIAGE = 'Menikahkan Anak',
  CIRCUMCISION_BAPTISM = 'Khitanan/Baptis',
  DEATH_CORE = 'Meninggal (Inti)',
  DEATH_HOUSE = 'Meninggal (Serumah)'
}

export interface Employee {
  id: string;
  name: string;
  role: Role;
  storeId: string;
  areaId: string;
  joinDate: string; // YYYY-MM-DD
  annualLeaveUsed: number;
  username?: string;
  password?: string;
}

export enum LeaveStatus {
  PENDING = 'Menunggu',
  APPROVED = 'Disetujui',
  REJECTED = 'Ditolak'
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  rejectionReason?: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  message: string;
}