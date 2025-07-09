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
};

export type Appointment = {
  id: string;
  patient: Pick<Patient, 'name' | 'avatar'>;
  doctor: Pick<Doctor, 'name' | 'avatar'>;
  date: string;
  startTime: string;
  endTime: string;
  status: 'Scheduled' | 'Completed' | 'Canceled';
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
