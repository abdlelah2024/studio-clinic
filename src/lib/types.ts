
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

export type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting';

export type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
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
    timestamp: string; // ISO string
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
  timestamp: string; // ISO string
};

export type DataField = {
  id: string;
  label: string;
  type: 'نظام' | 'مخصص';
  required: boolean;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  type: 'appointment_confirmed' | 'appointment_canceled' | 'new_patient' | 'system_alert';
  read: boolean;
  timestamp: string; // ISO string
};
