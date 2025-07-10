
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient, Doctor, User, UserRole, Permissions, DataField } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import * as firestoreService from "@/services/firestore"

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
  loading: boolean;
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
    const [loading, setLoading] = useState(true);
    // Main Data State
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [permissions, setPermissions] = useState<Record<UserRole, Permissions>>({} as Record<UserRole, Permissions>);
    const [dataFields, setDataFields] = useState<DataField[]>([]);

    // Dialog States
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions | null>(null);
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [patientDialogOptions, setPatientDialogOptions] = useState<PatientDialogOptions | null>(null);

    
    const { toast } = useToast();

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [
                    patientsData,
                    doctorsData,
                    appointmentsData,
                    usersData,
                    permissionsData,
                    dataFieldsData,
                ] = await Promise.all([
                    firestoreService.getPatients(),
                    firestoreService.getDoctors(),
                    firestoreService.getAppointments(),
                    firestoreService.getUsers(),
                    firestoreService.getPermissions(),
                    firestoreService.getDataFields(),
                ]);

                setPatients(patientsData);
                setDoctors(doctorsData);
                setAppointments(appointmentsData);
                setUsers(usersData);
                setPermissions(permissionsData);
                setDataFields(dataFieldsData);

            } catch (error) {
                console.error("Failed to fetch data from Firestore:", error);
                toast({
                    title: "فشل تحميل البيانات",
                    description: "لم نتمكن من تحميل البيانات من قاعدة البيانات. يرجى المحاولة مرة أخرى.",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);


    // --- Memoized Enriched Data ---
    const enrichedAppointments = useMemo(() => {
        if (loading) return [];
        return appointments.map(appointment => {
            const patient = patients.find(p => p.id === appointment.patientId);
            const doctor = doctors.find(d => d.id === appointment.doctorId);
            if (!patient || !doctor) return null;
            return { ...appointment, patient, doctor };
        }).filter(Boolean) as (Appointment & { patient: Patient; doctor: Doctor; })[];
    }, [appointments, patients, doctors, loading]);


    // --- Patient Actions ---
    const addPatient: AddPatientFunction = useCallback(async (patient) => {
        try {
            const newPatientData = {
                ...patient,
                avatar: `https://placehold.co/100x100?text=${patient.name.charAt(0)}`,
                lastVisit: new Date().toISOString().split('T')[0],
            };
            const id = await firestoreService.addPatient(newPatientData);
            setPatients(prev => [{ id, ...newPatientData }, ...prev]);
            toast({
                title: "تمت الإضافة بنجاح",
                description: `تمت إضافة المريض ${patient.name} إلى السجلات.`,
            });
        } catch(e) {
             toast({ title: "خطأ", description: "فشل إضافة المريض.", variant: "destructive" });
        }
    }, [toast]);

    const updatePatient: UpdatePatientFunction = useCallback(async (updatedPatient) => {
        try {
            await firestoreService.updatePatient(updatedPatient.id, updatedPatient);
            setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
            toast({
                title: "تم التحديث بنجاح",
                description: `تم تحديث بيانات المريض ${updatedPatient.name}.`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل تحديث المريض.", variant: "destructive" });
        }
    }, [toast]);

    const deletePatient: DeletePatientFunction = useCallback(async (patientId) => {
        try {
            const patientName = patients.find(p => p.id === patientId)?.name;
            await firestoreService.deletePatient(patientId);
            setPatients(prev => prev.filter(p => p.id !== patientId));
            toast({
                title: "تم الحذف بنجاح",
                description: `تم حذف المريض ${patientName}.`,
                variant: "destructive"
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل حذف المريض.", variant: "destructive" });
        }
    }, [patients, toast]);

    const openNewPatientDialog = useCallback((options?: PatientDialogOptions) => {
        setPatientDialogOptions(options || {});
        setPatientDialogOpen(true);
    }, []);

    // --- Doctor Actions ---
    const addDoctor: AddDoctorFunction = useCallback(async (doctor) => {
        try {
            const newDoctorData = {
              ...doctor,
              avatar: `https://placehold.co/100x100?text=${doctor.name.charAt(0)}`,
            };
            const id = await firestoreService.addDoctor(newDoctorData);
            setDoctors(prev => [{ id, ...newDoctorData }, ...prev].sort((a,b) => a.name.localeCompare(b.name)));
            toast({
              title: "تمت الإضافة بنجاح",
              description: `تمت إضافة الطبيب ${doctor.name}.`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل إضافة الطبيب.", variant: "destructive" });
        }
    }, [toast]);

    const updateDoctor: UpdateDoctorFunction = useCallback(async (updatedDoctor) => {
        try {
            await firestoreService.updateDoctor(updatedDoctor.id, updatedDoctor);
            setDoctors(prev => prev.map(d => d.id === updatedDoctor.id ? updatedDoctor : d).sort((a,b) => a.name.localeCompare(b.name)));
            toast({
              title: "تم التحديث بنجاح",
              description: `تم تحديث بيانات الطبيب ${updatedDoctor.name}.`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل تحديث الطبيب.", variant: "destructive" });
        }
    }, [toast]);

    const deleteDoctor: DeleteDoctorFunction = useCallback(async (doctorId) => {
        try {
            const doctorName = doctors.find(d => d.id === doctorId)?.name;
            await firestoreService.deleteDoctor(doctorId);
            setDoctors(prev => prev.filter(d => d.id !== doctorId));
            toast({
              title: "تم الحذف بنجاح",
              description: `تم حذف الطبيب ${doctorName}.`,
              variant: "destructive",
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل حذف الطبيب.", variant: "destructive" });
        }
    }, [doctors, toast]);

    // --- Appointment Actions ---
    const addAppointment: AddAppointmentFunction = useCallback(async (appointment) => {
        try {
            const id = await firestoreService.addAppointment(appointment);
            setAppointments(prev => [{ id, ...appointment }, ...prev]);
            const patientName = patients.find(p => p.id === appointment.patientId)?.name || "Unknown Patient";
            const doctorName = doctors.find(d => d.id === appointment.doctorId)?.name || "Unknown Doctor";
            toast({
                title: "تمت جدولة الموعد بنجاح",
                description: `تم حجز موعد لـ ${patientName} مع ${doctorName}.`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل إضافة الموعد.", variant: "destructive" });
        }
    }, [patients, doctors, toast]);

    const updateAppointment: UpdateAppointmentFunction = useCallback(async (updatedAppointment) => {
        try {
            await firestoreService.updateAppointment(updatedAppointment.id, updatedAppointment);
            setAppointments(prev => prev.map(app => app.id === updatedAppointment.id ? updatedAppointment : app));
            toast({
                title: "تم تحديث الموعد بنجاح",
            });
        } catch(e) {
             toast({ title: "خطأ", description: "فشل تحديث الموعد.", variant: "destructive" });
        }
    }, [toast]);
    
    const deleteAppointment: DeleteAppointmentFunction = useCallback(async (appointmentId) => {
        try {
            await firestoreService.deleteAppointment(appointmentId);
            setAppointments(prev => prev.filter(app => app.id !== appointmentId));
            toast({
                title: "تم حذف الموعد",
                variant: "destructive"
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل حذف الموعد.", variant: "destructive" });
        }
    }, [toast]);

    const openNewAppointmentDialog = useCallback((options?: AppointmentDialogOptions) => {
        setAppointmentDialogOptions(options || {});
        setAppointmentDialogOpen(true);
    }, []);

    // User Actions
    const addUser: AddUserFunction = useCallback(async (user) => {
        try {
            const newUserData: User = {
                ...user,
                avatar: `https://placehold.co/100x100?text=${user.name.charAt(0)}`,
                status: 'offline',
            };
            await firestoreService.addUser(newUserData);
            setUsers(prev => [newUserData, ...prev]);
            toast({
                title: "تمت الإضافة بنجاح",
                description: `تمت إضافة المستخدم ${user.name}.`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل إضافة المستخدم.", variant: "destructive" });
        }
    }, [toast]);

    const updateUser: UpdateUserFunction = useCallback(async (updatedUser) => {
       try {
            await firestoreService.updateUser(updatedUser.email, updatedUser);
            setUsers(prev => prev.map(u => u.email === updatedUser.email ? updatedUser : u));
            toast({
                title: "تم التحديث بنجاح",
                description: `تم تحديث بيانات المستخدم ${updatedUser.name}.`,
            });
       } catch (e) {
            toast({ title: "خطأ", description: "فشل تحديث المستخدم.", variant: "destructive" });
       }
    }, [toast]);

    const deleteUser: DeleteUserFunction = useCallback(async (email) => {
        try {
            const userName = users.find(u => u.email === email)?.name;
            await firestoreService.deleteUser(email);
            setUsers(prev => prev.filter(u => u.email !== email));
            toast({
                title: "تم الحذف بنجاح",
                description: `تم حذف المستخدم ${userName}.`,
                variant: "destructive"
            });
        } catch (e) {
            toast({ title: "خطأ", description: "فشل حذف المستخدم.", variant: "destructive" });
        }
    }, [users, toast]);

    // Permission Actions
    const updatePermission: UpdatePermissionFunction = useCallback(async (role, section, action, value) => {
        const newPermissions = {
            ...permissions,
            [role]: {
                ...permissions[role],
                [section]: {
                ...permissions[role][section],
                [action]: value,
                },
            },
        };
        setPermissions(newPermissions);
        try {
            await firestoreService.updatePermissions({ [role]: newPermissions[role] });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل تحديث الصلاحيات.", variant: "destructive" });
            // Revert state on failure
            setPermissions(permissions);
        }
    }, [permissions, toast]);

    // Data Field Actions
    const addDataField: AddDataFieldFunction = useCallback(async (field) => {
        try {
            const newFieldData = {
                ...field,
                type: 'مخصص' as const,
            };
            const id = await firestoreService.addDataField(newFieldData);
            setDataFields(prev => [...prev, { id, ...newFieldData }]);
            toast({
                title: "تمت إضافة الحقل بنجاح",
                description: `تمت إضافة حقل "${field.label}".`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل إضافة الحقل.", variant: "destructive" });
        }
    }, [toast]);

    const updateDataField: UpdateDataFieldFunction = useCallback(async (updatedField) => {
        try {
            await firestoreService.updateDataField(updatedField.id, updatedField);
            setDataFields(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
            toast({
                title: "تم تحديث الحقل بنجاح",
                description: `تم تحديث حقل "${updatedField.label}".`,
            });
        } catch(e) {
            toast({ title: "خطأ", description: "فشل تحديث الحقل.", variant: "destructive" });
        }
    }, [toast]);

    const deleteDataField: DeleteDataFieldFunction = useCallback(async (fieldId) => {
        try {
            const fieldLabel = dataFields.find(f => f.id === fieldId)?.label;
            await firestoreService.deleteDataField(fieldId);
            setDataFields(prev => prev.filter(f => f.id !== fieldId));
            toast({
                title: "تم حذف الحقل بنجاح",
                description: `تم حذف حقل "${fieldLabel}".`,
                variant: "destructive"
            });
        } catch(e) {
             toast({ title: "خطأ", description: "فشل حذف الحقل.", variant: "destructive" });
        }
    }, [dataFields, toast]);


    const value: AppContextType = {
        loading,
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
