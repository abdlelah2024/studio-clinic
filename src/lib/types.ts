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

export type User = {
    name: string;
    email: string;
    avatar: string;
    role: 'Admin' | 'Doctor' | 'Receptionist';
};
