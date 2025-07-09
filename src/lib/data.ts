import type { User, Patient, Doctor, Appointment } from './types';
import { subDays, formatISO } from 'date-fns';

export const mockUser: User = {
  name: 'Dr. Emily Carter',
  email: 'emily.carter@clinicflow.com',
  avatar: 'https://placehold.co/100x100',
  role: 'Admin',
};

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'John Doe', lastVisit: '2023-10-15', avatar: 'https://placehold.co/100x100', email: 'john.d@example.com', phone: '555-0101', dob: '1985-05-20' },
  { id: 'p2', name: 'Jane Smith', lastVisit: '2023-11-02', avatar: 'https://placehold.co/100x100', email: 'jane.s@example.com', phone: '555-0102', dob: '1992-08-12' },
  { id: 'p3', name: 'Michael Johnson', lastVisit: '2023-09-20', avatar: 'https://placehold.co/100x100', email: 'michael.j@example.com', phone: '555-0103', dob: '1978-11-30' },
  { id: 'p4', name: 'Sarah Williams', lastVisit: '2023-10-28', avatar: 'https://placehold.co/100x100', email: 'sarah.w@example.com', phone: '555-0104', dob: '2001-02-14' },
  { id: 'p5', name: 'David Brown', lastVisit: '2023-11-05', avatar: 'https://placehold.co/100x100', email: 'david.b@example.com', phone: '555-0105', dob: '1989-07-22' },
];

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'Dr. Emily Carter', specialty: 'Cardiology', avatar: 'https://placehold.co/100x100' },
  { id: 'd2', name: 'Dr. Ben Hanson', specialty: 'Pediatrics', avatar: 'https://placehold.co/100x100' },
  { id: 'd3', name: 'Dr. Olivia Chen', specialty: 'Dermatology', avatar: 'https://placehold.co/100x100' },
];

const today = new Date();
const getISODate = (dayOffset = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  { id: 'a1', patient: { name: 'John Doe', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: getISODate(), startTime: '09:00', endTime: '09:30', status: 'Scheduled', reason: 'Annual Checkup' },
  { id: 'a2', patient: { name: 'Jane Smith', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(), startTime: '10:00', endTime: '10:45', status: 'Scheduled', reason: 'Vaccination' },
  { id: 'a3', patient: { name: 'Michael Johnson', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: formatISO(subDays(new Date(), 3), { representation: 'date'}), startTime: '11:00', endTime: '11:30', status: 'Completed', reason: 'Follow-up' },
  { id: 'a4', patient: { name: 'Sarah Williams', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[2], date: getISODate(1), startTime: '14:00', endTime: '14:30', status: 'Scheduled', reason: 'Skin rash consultation' },
  { id: 'a5', patient: { name: 'David Brown', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(1), startTime: '09:30', endTime: '10:00', status: 'Canceled', reason: 'Childhood Illness' },
  { id: 'a6', patient: { name: 'Laura Wilson', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: formatISO(subDays(new Date(), 10), { representation: 'date'}), startTime: '13:00', endTime: '13:30', status: 'Completed', reason: 'Chest Pain' },
];
