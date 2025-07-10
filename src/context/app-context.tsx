
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient, Doctor, User, UserRole, Permissions, DataField, Message, AuditLog, Notification } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import * as firestoreService from "@/services/firestore"
import { useAuth } from "./auth-context"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

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

type AddMessageFunction = (message: Omit<Message, 'id' | 'timestamp'>) => void;

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
  messages: Message[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  
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

  // Message Actions
  addMessage: AddMessageFunction;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Function to seed the admin user
const seedAdminUser = async () => {
    const adminEmail = "asd19082@gmail.com";
    const adminPassword = "159632Asd";
    
    try {
        // Check if user exists in Firestore
        const userExists = await firestoreService.checkUserExists(adminEmail);
        
        if (!userExists) {
            console.log("Admin user does not exist, creating...");
            // Create user in Firebase Auth
            try {
                await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
                console.log("Admin user created in Firebase Auth.");
            } catch (error: any) {
                // If user already exists in Auth but not in Firestore
                if (error.code !== 'auth/email-already-in-use') {
                    throw error;
                }
                console.log("Admin user already exists in Firebase Auth.");
            }
            
            // Add user to Firestore
            const adminUserData: User = {
                name: "Admin User",
                email: adminEmail,
                role: 'Admin',
                avatar: `https://placehold.co/100x100?text=A`,
                status: 'offline',
            };
            await firestoreService.addUser(adminUserData);
            console.log("Admin user document created in Firestore.");
        }
    } catch (error) {
        console.error("Error seeding admin user:", error);
    }
};


export function AppProvider({ children }: { children: ReactNode }) {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    // Main Data State
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [permissions, setPermissions] = useState<Record<UserRole, Permissions>>({} as Record<UserRole, Permissions>);
    const [dataFields, setDataFields] = useState<DataField[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Dialog States
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions | null>(null);
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [patientDialogOptions, setPatientDialogOptions] = useState<PatientDialogOptions | null>(null);

    
    const { toast } = useToast();

    // --- Data Seeding ---
    useEffect(() => {
        seedAdminUser();
    }, []);

    // --- Real-time Data Fetching ---
    useEffect(() => {
        if (!currentUser) {
            setLoading(false);
            return;
        };

        const unsubscribers: (() => void)[] = [];
        let isCancelled = false;
        
        const fetchData = async () => {
            setLoading(true);
            try {
                // One-time fetches
                const permissionsData = await firestoreService.getPermissions();
                if (!isCancelled) {
                    setPermissions(permissionsData);
                }

                // Real-time listeners
                unsubscribers.push(firestoreService.listenToCollection('patients', setPatients, { orderBy: 'lastVisit', direction: 'desc' }));
                unsubscribers.push(firestoreService.listenToCollection('doctors', setDoctors, { orderBy: 'name' }));
                unsubscribers.push(firestoreService.listenToCollection('appointments', setAppointments, { orderBy: 'date', direction: 'desc' }));
                unsubscribers.push(firestoreService.listenToCollection('users', (data) => {
                   if (!isCancelled) {
                        const enrichedUsers = data.map(u => ({
                            ...u,
                            status: (u.email === currentUser.email) ? 'online' : u.status || 'offline'
                        }))
                        setUsers(enrichedUsers);
                    }
                }, { idField: 'email' }));
                unsubscribers.push(firestoreService.listenToCollection('dataFields', setDataFields, {}));
                unsubscribers.push(firestoreService.listenToCollection('messages', setMessages, { orderBy: 'timestamp', direction: 'asc' }));
                unsubscribers.push(firestoreService.listenToCollection('auditLogs', setAuditLogs, { orderBy: 'timestamp', direction: 'desc' }));
                unsubscribers.push(firestoreService.listenToCollection('notifications', setNotifications, { orderBy: 'timestamp', direction: 'desc' }));

            } catch (error) {
                console.error("Failed to fetch data from Firestore:", error);
                if (!isCancelled) {
                    toast({
                        title: "فشل تحميل البيانات",
                        description: "لم نتمكن من تحميل البيانات من قاعدة البيانات. يرجى المحاولة مرة أخرى.",
                        variant: "destructive"
                    });
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isCancelled = true;
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    }, [toast, currentUser]);


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
            await firestoreService.addPatient(newPatientData);
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
            await firestoreService.addDoctor(newDoctorData);
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
            await firestoreService.addAppointment(appointment);
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
            await firestoreService.addDataField(newFieldData);
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
            toast({
                title: "تم حذف الحقل بنجاح",
                description: `تم حذف حقل "${fieldLabel}".`,
                variant: "destructive"
            });
        } catch(e) {
             toast({ title: "خطأ", description: "فشل حذف الحقل.", variant: "destructive" });
        }
    }, [dataFields, toast]);
    
    // Message Actions
    const addMessage: AddMessageFunction = useCallback(async (message) => {
        try {
            const newMessageData = {
                ...message,
                timestamp: new Date().toISOString(),
            };
            await firestoreService.addMessage(newMessageData);
        } catch (e) {
            toast({ title: "خطأ", description: "فشل إرسال الرسالة.", variant: "destructive" });
        }
    }, [toast]);


    const value: AppContextType = {
        loading,
        patients,
        doctors,
        appointments,
        users,
        permissions,
        dataFields,
        messages,
        auditLogs,
        notifications,
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
        addMessage,
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
