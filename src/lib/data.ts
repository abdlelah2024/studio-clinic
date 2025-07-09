import type { User, Patient, Doctor, Appointment } from './types';
import { subDays, formatISO } from 'date-fns';

export const mockUser: User = {
  name: 'د. إميلي كارتر',
  email: 'emily.carter@clinicflow.com',
  avatar: 'https://placehold.co/100x100',
  role: 'Admin',
};

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'أحمد محمود', lastVisit: '2023-10-15', avatar: 'https://placehold.co/100x100', email: 'ahmad.m@example.com', phone: '555-0101', dob: '1985-05-20' },
  { id: 'p2', name: 'فاطمة علي', lastVisit: '2023-11-02', avatar: 'https://placehold.co/100x100', email: 'fatima.a@example.com', phone: '555-0102', dob: '1992-08-12' },
  { id: 'p3', name: 'خالد عبد الله', lastVisit: '2023-09-20', avatar: 'https://placehold.co/100x100', email: 'khalid.a@example.com', phone: '555-0103', dob: '1978-11-30' },
  { id: 'p4', name: 'سارة حسين', lastVisit: '2023-10-28', avatar: 'https://placehold.co/100x100', email: 'sara.h@example.com', phone: '555-0104', dob: '2001-02-14' },
  { id: 'p5', name: 'يوسف محمد', lastVisit: '2023-11-05', avatar: 'https://placehold.co/100x100', email: 'youssef.m@example.com', phone: '555-0105', dob: '1989-07-22' },
];

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'د. إميلي كارتر', specialty: 'أمراض القلب', avatar: 'https://placehold.co/100x100' },
  { id: 'd2', name: 'د. بن هانسون', specialty: 'طب الأطفال', avatar: 'https://placehold.co/100x100' },
  { id: 'd3', name: 'د. أوليفيا تشين', specialty: 'الأمراض الجلدية', avatar: 'https://placehold.co/100x100' },
];

const today = new Date();
const getISODate = (dayOffset = 0) => {
  const date = new Date(today);
  date.setDate(today.getDate() + dayOffset);
  return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  { id: 'a1', patient: { name: 'أحمد محمود', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: getISODate(), startTime: '09:00', endTime: '09:30', status: 'Scheduled', reason: 'فحص سنوي' },
  { id: 'a2', patient: { name: 'فاطمة علي', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(), startTime: '10:00', endTime: '10:45', status: 'Scheduled', reason: 'تطعيم' },
  { id: 'a3', patient: { name: 'خالد عبد الله', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: formatISO(subDays(new Date(), 3), { representation: 'date'}), startTime: '11:00', endTime: '11:30', status: 'Completed', reason: 'متابعة' },
  { id: 'a4', patient: { name: 'سارة حسين', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[2], date: getISODate(1), startTime: '14:00', endTime: '14:30', status: 'Scheduled', reason: 'استشارة طفح جلدي' },
  { id: 'a5', patient: { name: 'يوسف محمد', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(1), startTime: '09:30', endTime: '10:00', status: 'Canceled', reason: 'مرض طفولي' },
  { id: 'a6', patient: { name: 'ليلى إبراهيم', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: formatISO(subDays(new Date(), 10), { representation: 'date'}), startTime: '13:00', endTime: '13:30', status: 'Completed', reason: 'ألم في الصدر' },
];
