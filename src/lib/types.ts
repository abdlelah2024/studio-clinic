export type Patient = {
  id: string;
  name: string;
  lastVisit: string;
  avatar: string;
  phone: string;
  age: number;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
  servicePrice?: number;
  freeReturnPeriod?: number; // in days
};

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting';
  reason: string;
  freeReturn?: boolean;
};

export type UserRole = 'Admin' | 'Doctor' | 'Receptionist';

export type User = {
    name: string;
    email: string;
    avatar: string;
    role: UserRole;
    password?: string;
    status: 'online' | 'offline';
};

export type Permissions = {
  patients: { add: boolean; edit: boolean; delete: boolean };
  doctors: { add: boolean; edit: boolean; delete: boolean };
  appointments: { add: boolean; edit: boolean; delete: boolean; cancel: boolean };
  users: { add: boolean; edit: boolean; delete: boolean };
};

export type Message = {
    id: string;
    senderEmail: string;
    receiverEmail: string;
    text: string;
    timestamp: string;
};

export type AuditLogAction = 'Create' | 'Update' | 'Delete' | 'Cancel' | 'Login';
export type AuditLogCategory = 'Patient' | 'Doctor' | 'Appointment' | 'User' | 'System' | 'Report';

export type AuditLog = {
  id: string;
  action: AuditLogAction;
  category: AuditLogCategory;
  user: {
    name: string;
    avatar: string;
  };
  details: string;
  timestamp: string; // ISO string for sorting
};
