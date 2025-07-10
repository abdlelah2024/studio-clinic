
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient, Doctor, User, UserRole, Permissions, DataField, Message, AuditLog, Notification } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "./auth-context"
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, onSnapshot, collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);


// Generic function to listen to a collection with optional ordering
const listenToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  options: {
    idField?: string;
    orderBy?: string;
    direction?: 'asc' | 'desc';
  }
): (() => void) => {
  const { idField = 'id', orderBy: orderByField, direction = 'asc' } = options;

  let q: any = collection(db, collectionName);

  if (orderByField) {
    q = query(q, orderBy(orderByField, direction));
  }

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        [idField]: doc.id,
        ...doc.data(),
      })) as T[];
      callback(data);
    },
    (error) => {
      console.error(`Error listening to ${collectionName}:`, error);
    }
  );

  return unsubscribe;
};

// Generic function to add a document
const addDocument = async <T extends object>(collectionName: string, data: T) => {
  const docRef = await addDoc(collection(db, collectionName), data);
  return docRef.id;
};

// Generic function to update a document
const updateDocument = async (collectionName: string, id: string, data: any) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

// Generic function to delete a document
const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};


// Specific functions for each collection
const addPatientDoc = (patient: Omit<Patient, 'id'>) => addDocument('patients', patient);
const updatePatientDoc = (id: string, patient: Partial<Patient>) => updateDocument('patients', id, patient);
const deletePatientDoc = (id: string) => deleteDocument('patients', id);

const addDoctorDoc = (doctor: Omit<Doctor, 'id'>) => addDocument('doctors', doctor);
const updateDoctorDoc = (id: string, doctor: Partial<Doctor>) => updateDocument('doctors', id, doctor);
const deleteDoctorDoc = (id: string) => deleteDocument('doctors', id);

const addAppointmentDoc = (appointment: Omit<Appointment, 'id'>) => addDocument('appointments', appointment);
const updateAppointmentDoc = (id: string, appointment: Partial<Appointment>) => updateDocument('appointments', id, appointment);
const deleteAppointmentDoc = (id: string) => deleteDocument('appointments', id);

const addUserDoc = (user: User) => setDoc(doc(db, "users", user.email), user, { merge: true });
const updateUserDoc = (email: string, user: Partial<User>) => updateDocument('users', email, user);
const deleteUserDoc = (email: string) => deleteDocument('users', email);
const checkUserExists = async (email: string): Promise<boolean> => {
    const docRef = doc(db, 'users', email);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
};


const addDataFieldDoc = (field: Omit<DataField, 'id'>) => addDocument('dataFields', field);
const updateDataFieldDoc = (id: string, field: Partial<DataField>) => updateDocument('dataFields', id, field);
const deleteDataFieldDoc = (id: string) => deleteDocument('dataFields', id);

const addMessageDoc = (message: Omit<Message, 'id'|'timestamp'>) => {
    return addDocument('messages', message);
};

const getPermissions = async (): Promise<Record<UserRole, Permissions>> => {
    const docRef = doc(db, 'system', 'permissions');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Record<UserRole, Permissions>;
    } else {
        console.warn("Permissions document not found, returning empty object.");
        return {} as Record<UserRole, Permissions>;
    }
};

const updatePermissions = async (permissions: Partial<Record<UserRole, Permissions>>) => {
    const docRef = doc(db, 'system', 'permissions');
    await setDoc(docRef, permissions, { merge: true });
};


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
        const userExists = await checkUserExists(adminEmail);
        
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
            await addUserDoc(adminUserData);
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
                const permissionsData = await getPermissions();
                if (!isCancelled) {
                    setPermissions(permissionsData);
                }

                // Real-time listeners
                unsubscribers.push(listenToCollection('patients', setPatients, { orderBy: 'lastVisit', direction: 'desc' }));
                unsubscribers.push(listenToCollection('doctors', setDoctors, { orderBy: 'name' }));
                unsubscribers.push(listenToCollection('appointments', setAppointments, { orderBy: 'date', direction: 'desc' }));
                unsubscribers.push(listenToCollection('users', (data) => {
                   if (!isCancelled) {
                        const enrichedUsers = data.map(u => ({
                            ...u,
                            status: (u.email === currentUser.email) ? 'online' : u.status || 'offline'
                        }))
                        setUsers(enrichedUsers);
                    }
                }, { idField: 'email' }));
                unsubscribers.push(listenToCollection('dataFields', setDataFields, {}));
                unsubscribers.push(listenToCollection('messages', setMessages, { orderBy: 'timestamp', direction: 'asc' }));
                unsubscribers.push(listenToCollection('auditLogs', setAuditLogs, { orderBy: 'timestamp', direction: 'desc' }));
                unsubscribers.push(listenToCollection('notifications', setNotifications, { orderBy: 'timestamp', direction: 'desc' }));

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
            await addPatientDoc(newPatientData);
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
            await updatePatientDoc(updatedPatient.id, updatedPatient);
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
            await deletePatientDoc(patientId);
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
            await addDoctorDoc(newDoctorData);
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
            await updateDoctorDoc(updatedDoctor.id, updatedDoctor);
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
            await deleteDoctorDoc(doctorId);
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
            await addAppointmentDoc(appointment);
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
            await updateAppointmentDoc(updatedAppointment.id, updatedAppointment);
            toast({
                title: "تم تحديث الموعد بنجاح",
            });
        } catch(e) {
             toast({ title: "خطأ", description: "فشل تحديث الموعد.", variant: "destructive" });
        }
    }, [toast]);
    
    const deleteAppointment: DeleteAppointmentFunction = useCallback(async (appointmentId) => {
        try {
            await deleteAppointmentDoc(appointmentId);
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
            await addUserDoc(newUserData);
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
            await updateUserDoc(updatedUser.email, updatedUser);
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
            await deleteUserDoc(email);
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
            await updatePermissions({ [role]: newPermissions[role] });
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
            await addDataFieldDoc(newFieldData);
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
            await updateDataFieldDoc(updatedField.id, updatedField);
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
            await deleteDataFieldDoc(fieldId);
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
            await addMessageDoc(newMessageData);
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
