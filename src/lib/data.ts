import type { User, Patient, Doctor, Appointment, UserRole, Permissions, Message, AuditLog } from './types';

export const mockUser: User = {
  name: 'المسؤول',
  email: 'asd19082@gmail.com',
  avatar: 'https://placehold.co/100x100/333/fff?text=A',
  role: 'Admin',
  password: '159632Asd',
  status: 'online',
};

export const mockPatients: Patient[] = [
  { id: 'p1', name: 'أحمد محمود', lastVisit: '2023-10-15', avatar: 'https://placehold.co/100x100', phone: '555-0101', age: 39 },
  { id: 'p2', name: 'فاطمة علي', lastVisit: '2023-11-02', avatar: 'https://placehold.co/100x100', phone: '555-0102', age: 32 },
  { id: 'p3', name: 'خالد عبد الله', lastVisit: '2023-09-20', avatar: 'https://placehold.co/100x100', phone: '555-0103', age: 45 },
  { id: 'p4', name: 'سارة حسين', lastVisit: '2023-10-28', avatar: 'https://placehold.co/100x100', phone: '555-0104', age: 23 },
  { id: 'p5', name: 'يوسف محمد', lastVisit: '2023-11-05', avatar: 'https://placehold.co/100x100', phone: '555-0105', age: 35 },
];

export const mockDoctors: Doctor[] = [
  { id: 'd1', name: 'د. إميلي كارتر', specialty: 'أمراض القلب', avatar: 'https://placehold.co/100x100', servicePrice: 250, freeReturnPeriod: 14 },
  { id: 'd2', name: 'د. بن هانسون', specialty: 'طب الأطفال', avatar: 'https://placehold.co/100x100', servicePrice: 150, freeReturnPeriod: 7 },
  { id: 'd3', name: 'د. أوليفيا تشين', specialty: 'الأمراض الجلدية', avatar: 'https://placehold.co/100x100', servicePrice: 200 },
];

const getISODate = (year: number, month: number, day: number) => {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toISOString().split('T')[0];
};

export const mockAppointments: Appointment[] = [
  { id: 'a1', patient: { name: 'أحمد محمود', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: getISODate(2025, 7, 10), startTime: '09:00', endTime: '09:30', status: 'Scheduled', reason: 'فحص سنوي', freeReturn: true },
  { id: 'a2', patient: { name: 'فاطمة علي', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(2025, 7, 10), startTime: '10:00', endTime: '10:45', status: 'Waiting', reason: 'تطعيم' },
  { id: 'a3', patient: { name: 'خالد عبد الله', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: getISODate(2025, 7, 7), startTime: '11:00', endTime: '11:30', status: 'Completed', reason: 'متابعة' },
  { id: 'a4', patient: { name: 'سارة حسين', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[2], date: getISODate(2025, 7, 11), startTime: '14:00', endTime: '14:30', status: 'Scheduled', reason: 'استشارة طفح جلدي' },
  { id: 'a5', patient: { name: 'يوسف محمد', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[1], date: getISODate(2025, 7, 11), startTime: '09:30', endTime: '10:00', status: 'Canceled', reason: 'مرض طفولي' },
  { id: 'a6', patient: { name: 'ليلى إبراهيم', avatar: 'https://placehold.co/100x100' }, doctor: mockDoctors[0], date: getISODate(2025, 6, 30), startTime: '13:00', endTime: '13:30', status: 'Completed', reason: 'ألم في الصدر' },
];


export const initialPermissions: Record<UserRole, Permissions> = {
  Admin: {
    patients: { add: true, edit: true, delete: true },
    doctors: { add: true, edit: true, delete: true },
    appointments: { add: true, edit: true, delete: true, cancel: true },
    users: { add: true, edit: true, delete: true },
  },
  Doctor: {
    patients: { add: true, edit: true, delete: false },
    doctors: { add: false, edit: false, delete: false },
    appointments: { add: true, edit: true, delete: false, cancel: true },
    users: { add: false, edit: false, delete: false },
  },
  Receptionist: {
    patients: { add: true, edit: true, delete: false },
    doctors: { add: false, edit: false, delete: false },
    appointments: { add: true, edit: true, delete: false, cancel: true },
    users: { add: false, edit: false, delete: false },
  },
};

export const otherUsers: User[] = [
  { name: "د. بن هانسون", email: "ben.h@clinicflow.demo", avatar: "https://placehold.co/100x100/A5D8FF/000000.png?text=B", role: "Doctor", password: "password123", status: 'online' },
  { name: "علياء منصور", email: "alia.m@clinicflow.demo", avatar: "https://placehold.co/100x100/FFC0CB/000000.png?text=A", role: "Receptionist", password: "password123", status: 'offline' },
];

export const allUsers: User[] = [mockUser, ...otherUsers];

export const mockMessages: Message[] = [
    { id: 'm1', senderEmail: 'ben.h@clinicflow.demo', receiverEmail: 'asd19082@gmail.com', text: 'مرحبًا د. إميلي، هل يمكنك مراجعة مخطط المريض الجديد؟', timestamp: '10:00 ص' },
    { id: 'm2', senderEmail: 'asd19082@gmail.com', receiverEmail: 'ben.h@clinicflow.demo', text: 'بالتأكيد د. بن، سألقي نظرة عليه الآن.', timestamp: '10:01 ص' },
    { id: 'm3', senderEmail: 'ben.h@clinicflow.demo', receiverEmail: 'asd19082@gmail.com', text: 'شكرًا لك!', timestamp: '10:02 ص' },
    { id: 'm4', senderEmail: 'alia.m@clinicflow.demo', receiverEmail: 'asd19082@gmail.com', text: 'صباح الخير، تم تأكيد جميع مواعيد اليوم.', timestamp: '09:30 ص' },
];

const now = new Date();
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log1',
    action: 'Create',
    category: 'Patient',
    user: mockUser,
    details: 'أضاف مريضًا جديدًا: أحمد محمود',
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log2',
    action: 'Update',
    category: 'Appointment',
    user: otherUsers[1],
    details: 'تحديث موعد فاطمة علي',
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log3',
    action: 'Login',
    category: 'System',
    user: otherUsers[0],
    details: 'تسجيل الدخول إلى النظام',
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'log4',
    action: 'Delete',
    category: 'Doctor',
    user: mockUser,
    details: 'إزالة الطبيب: د. ماركوس لي',
    timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  },
   {
    id: 'log5',
    action: 'Create',
    category: 'Report',
    user: otherUsers[0],
    details: 'إنشاء مسودة تقرير للمريض: خالد عبد الله',
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

    