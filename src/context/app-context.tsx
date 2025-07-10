
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient, Doctor, User, UserRole, Permissions, DataField } from "@/lib/types"
import { mockPatients, mockDoctors, mockAppointments, allUsers, initialPermissions, initialDataFields } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

type AddAppointmentFunction = (appointment: Omit<Appointment, 'id'>) => void;
type UpdateAppointmentFunction = (appointment: Appointment) => void;
type DeleteAppointmentFunction = (appointmentId: string) => void;

type AddPatientFunction = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => void;
type UpdatePatientFunction = (patient: Patient) => void;
type DeletePatientFunction = (patientId: string) => void;

type AddDoctorFunction = (doctor: Omit<Doctor, 'id' | 'avatar'>) => void;
type UpdateDoctorFunction = (doctor: Doctor) => void;
type DeleteDoctorFunction = (doctorId: string) => void;

type AddUserFunction = (user: Omit<User, 'avatar' | 'status'>) => void;
type UpdateUserFunction = (user: User) => void;
type DeleteUserFunction = (email: string) => void;

type UpdatePermissionFunction = (role: UserRole, section: keyof Permissions['Admin'], action: keyof Permissions['Admin']['patients'], value: boolean) => void;


type AddDataFieldFunction = (field: { label: string, required: boolean }) => void;
type UpdateDataFieldFunction = (field: DataField) => void;
type DeleteDataFieldFunction = (fieldId: string) => void;

interface AppointmentDialogOptions {
    initialPatientId?: string;
}

interface PatientDialogOptions {
    initialName?: string;
}

interface AppContextType {
  // Data
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  users: User[];
  permissions: Record<UserRole, Permissions>;
  dataFields: DataField[];
  
  // Enriched Data
  enrichedAppointments: (Appointment & { patient: Patient; doctor: Doctor; })[];

  // Patient Actions
  openNewPatientDialog: (options?: PatientDialogOptions) => void;
  addPatient: AddPatientFunction;
  updatePatient: UpdatePatientFunction;
  deletePatient: DeletePatientFunction;
  
  // Doctor Actions
  addDoctor: AddDoctorFunction;
  updateDoctor: UpdateDoctorFunction;
  deleteDoctor: DeleteDoctorFunction;

  // Appointment Actions
  openNewAppointmentDialog: (options?: AppointmentDialogOptions) => void;
  addAppointment: AddAppointmentFunction;
  updateAppointment: UpdateAppointmentFunction;
  deleteAppointment: DeleteAppointmentFunction;

  // User Actions
  addUser: AddUserFunction;
  updateUser: UpdateUserFunction;
  deleteUser: DeleteUserFunction;

  // Permission Actions
  updatePermission: UpdatePermissionFunction;
  
  // Data Field Actions
  addDataField: AddDataFieldFunction;
  updateDataField: UpdateDataFieldFunction;
  deleteDataField: DeleteDataFieldFunction;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // Main Data State
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [users, setUsers] = useState<User[]>(allUsers);
    const [permissions, setPermissions] = useState<Record<UserRole, Permissions>>(initialPermissions);
    const [dataFields, setDataFields] = useState<DataField[]>(initialDataFields);

    // Dialog States
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions | null>(null);
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [patientDialogOptions, setPatientDialogOptions] = useState<PatientDialogOptions | null>(null);

    
    const { toast } = useToast();

    // --- Memoized Enriched Data ---
    const enrichedAppointments = useMemo(() => {
        return appointments.map(appointment => {
            const patient = patients.find(p => p.id === appointment.patientId);
            const doctor = doctors.find(d => d.id === appointment.doctorId);
            if (!patient || !doctor) return null;
            return { ...appointment, patient, doctor };
        }).filter(Boolean) as (Appointment & { patient: Patient; doctor: Doctor; })[];
    }, [appointments, patients, doctors]);


    // --- Patient Actions ---
    const addPatient: AddPatientFunction = useCallback((patient) => {
        const newPatient: Patient = {
            ...patient,
            id: `p${Date.now()}`,
            avatar: `https://placehold.co/100x100?text=${patient.name.charAt(0)}`,
            lastVisit: new Date().toISOString().split('T')[0],
        };
        setPatients(prev => [newPatient, ...prev]);
        toast({
            title: "تمت الإضافة بنجاح",
            description: `تمت إضافة المريض ${patient.name} إلى السجلات.`,
        });
    }, [toast]);

    const updatePatient: UpdatePatientFunction = useCallback((updatedPatient) => {
        setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        toast({
            title: "تم التحديث بنجاح",
            description: `تم تحديث بيانات المريض ${updatedPatient.name}.`,
        });
    }, [toast]);

    const deletePatient: DeletePatientFunction = useCallback((patientId) => {
        const patientName = patients.find(p => p.id === patientId)?.name;
        setPatients(prev => prev.filter(p => p.id !== patientId));
        toast({
            title: "تم الحذف بنجاح",
            description: `تم حذف المريض ${patientName}.`,
            variant: "destructive"
        });
    }, [patients, toast]);

    const openNewPatientDialog = useCallback((options?: PatientDialogOptions) => {
        setPatientDialogOptions(options || {});
        setPatientDialogOpen(true);
    }, []);

    // --- Doctor Actions ---
    const addDoctor: AddDoctorFunction = useCallback((doctor) => {
        const newDoctor: Doctor = {
          ...doctor,
          id: `d${Date.now()}`,
          avatar: `https://placehold.co/100x100?text=${doctor.name.charAt(0)}`,
        };
        setDoctors(prev => [newDoctor, ...prev]);
        toast({
          title: "تمت الإضافة بنجاح",
          description: `تمت إضافة الطبيب ${doctor.name}.`,
        });
    }, [toast]);

    const updateDoctor: UpdateDoctorFunction = useCallback((updatedDoctor) => {
        setDoctors(prev => prev.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
        toast({
          title: "تم التحديث بنجاح",
          description: `تم تحديث بيانات الطبيب ${updatedDoctor.name}.`,
        });
    }, [toast]);

    const deleteDoctor: DeleteDoctorFunction = useCallback((doctorId) => {
        const doctorName = doctors.find(d => d.id === doctorId)?.name;
        setDoctors(prev => prev.filter(d => d.id !== doctorId));
        toast({
          title: "تم الحذف بنجاح",
          description: `تم حذف الطبيب ${doctorName}.`,
          variant: "destructive",
        });
    }, [doctors, toast]);

    // --- Appointment Actions ---
    const addAppointment: AddAppointmentFunction = useCallback((appointment) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: `a${Date.now()}`,
        };
        setAppointments(prev => [newAppointment, ...prev]);
        const patientName = patients.find(p => p.id === appointment.patientId)?.name || "Unknown Patient";
        const doctorName = doctors.find(d => d.id === appointment.doctorId)?.name || "Unknown Doctor";
        toast({
            title: "تمت جدولة الموعد بنجاح",
            description: `تم حجز موعد لـ ${patientName} مع ${doctorName}.`,
        });
    }, [patients, doctors, toast]);

    const updateAppointment: UpdateAppointmentFunction = useCallback((updatedAppointment) => {
        setAppointments(prev => prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
        toast({
            title: "تم تحديث الموعد بنجاح",
        });
    }, [toast]);
    
    const deleteAppointment: DeleteAppointmentFunction = useCallback((appointmentId) => {
        setAppointments(prev => prev.filter(app => app.id !== appointmentId));
        toast({
            title: "تم حذف الموعد",
            variant: "destructive"
        });
    }, [toast]);

    const openNewAppointmentDialog = useCallback((options?: AppointmentDialogOptions) => {
        setAppointmentDialogOptions(options || {});
        setAppointmentDialogOpen(true);
    }, []);

    // User Actions
    const addUser: AddUserFunction = useCallback((user) => {
        const newUser: User = {
        ...user,
        avatar: `https://placehold.co/100x100?text=${user.name.charAt(0)}`,
        status: 'offline',
        };
        setUsers(prev => [newUser, ...prev]);
        toast({
        title: "تمت الإضافة بنجاح",
        description: `تمت إضافة المستخدم ${user.name}.`,
        });
    }, [toast]);

    const updateUser: UpdateUserFunction = useCallback((updatedUser) => {
        setUsers(prev => prev.map(u => u.email === updatedUser.email ? updatedUser : u));
        toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث بيانات المستخدم ${updatedUser.name}.`,
        });
    }, [toast]);

    const deleteUser: DeleteUserFunction = useCallback((email) => {
        const userName = users.find(u => u.email === email)?.name;
        setUsers(prev => prev.filter(u => u.email !== email));
        toast({
        title: "تم الحذف بنجاح",
        description: `تم حذف المستخدم ${userName}.`,
        variant: "destructive"
        });
    }, [users, toast]);

    // Permission Actions
    const updatePermission: UpdatePermissionFunction = useCallback((role, section, action, value) => {
        setPermissions(prev => ({
        ...prev,
        [role]: {
            ...prev[role],
            [section]: {
            ...prev[role][section],
            [action]: value,
            },
        },
        }));
    }, []);

    // Data Field Actions
    const addDataField: AddDataFieldFunction = useCallback((field) => {
        const newField: DataField = {
        ...field,
        id: `custom-${Date.now()}`,
        type: 'مخصص',
        };
        setDataFields(prev => [...prev, newField]);
        toast({
        title: "تمت إضافة الحقل بنجاح",
        description: `تمت إضافة حقل "${field.label}".`,
        });
    }, [toast]);

    const updateDataField: UpdateDataFieldFunction = useCallback((updatedField) => {
        setDataFields(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
        toast({
        title: "تم تحديث الحقل بنجاح",
        description: `تم تحديث حقل "${updatedField.label}".`,
        });
    }, [toast]);

    const deleteDataField: DeleteDataFieldFunction = useCallback((fieldId) => {
        const fieldLabel = dataFields.find(f => f.id === fieldId)?.label;
        setDataFields(prev => prev.filter(f => f.id !== fieldId));
        toast({
        title: "تم حذف الحقل بنجاح",
        description: `تم حذف حقل "${fieldLabel}".`,
        variant: "destructive"
        });
    }, [dataFields, toast]);


    const value: AppContextType = {
        patients,
        doctors,
        appointments,
        users,
        permissions,
        dataFields,
        enrichedAppointments,
        openNewPatientDialog,
        addPatient,
        updatePatient,
        deletePatient,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        openNewAppointmentDialog,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        addUser,
        updateUser,
        deleteUser,
        updatePermission,
        addDataField,
        updateDataField,
        deleteDataField,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <NewAppointmentDialog
                open={isAppointmentDialogOpen}
                onOpenChange={setAppointmentDialogOpen}
                initialPatientId={appointmentDialogOptions?.initialPatientId}
            />
            <AddPatientDialog
                open={isPatientDialogOpen}
                onOpenChange={setPatientDialogOpen}
                onPatientAdded={addPatient}
                initialName={patientDialogOptions?.initialName}
            />
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}
