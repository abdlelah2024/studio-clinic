
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo, useEffect } from "react"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Patient, Doctor, User, UserRole, Permissions, DataField, Message, AuditLog, Notification, AuditLogAction, AuditLogCategory } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { db, auth } from "@/services/firestore"
import { onSnapshot, collection, query, orderBy, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore"
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, User as FirebaseUser } from 'firebase/auth';

// --- AppContext Types ---
type AddPatientFunction = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => void;
type UpdatePatientFunction = (patient: Patient) => void;
type DeletePatientFunction = (patientId: string) => void;
type AddDoctorFunction = (doctor: Omit<Doctor, 'id' | 'avatar'>) => void;
type UpdateDoctorFunction = (doctor: Doctor) => void;
type DeleteDoctorFunction = (doctorId: string) => void;
type AddUserFunction = (user: Omit<User, 'avatar' | 'status'>) => Promise<void>;
type UpdateUserFunction = (user: User) => void;
type DeleteUserFunction = (email: string) => void;
type UpdatePermissionFunction = (role: UserRole, section: keyof Permissions['Admin'], action: keyof Permissions['Admin']['patients'], value: boolean) => void;
type AddDataFieldFunction = (field: { label: string, required: boolean }) => void;
type UpdateDataFieldFunction = (field: DataField) => void;
type DeleteDataFieldFunction = (fieldId: string) => void;
type AddMessageFunction = (message: Omit<Message, 'id' | 'timestamp'>) => void;
interface PatientDialogOptions { initialName?: string; }

interface AppContextType {
  // Auth
  currentUser: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Data
  patients: Patient[];
  doctors: Doctor[];
  users: User[];
  permissions: Record<UserRole, Permissions>;
  dataFields: DataField[];
  messages: Message[];
  auditLogs: AuditLog[];
  notifications: Notification[];
  
  // Actions
  openNewPatientDialog: (options?: PatientDialogOptions) => void;
  addPatient: AddPatientFunction;
  updatePatient: UpdatePatientFunction;
  deletePatient: DeletePatientFunction;
  addDoctor: AddDoctorFunction;
  updateDoctor: UpdateDoctorFunction;
  deleteDoctor: DeleteDoctorFunction;
  addUser: AddUserFunction;
  updateUser: UpdateUserFunction;
  deleteUser: DeleteUserFunction;
  updatePermission: UpdatePermissionFunction;
  addDataField: AddDataFieldFunction;
  updateDataField: UpdateDataFieldFunction;
  deleteDataField: DeleteDataFieldFunction;
  addMessage: AddMessageFunction;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// --- Firebase Helpers ---
const listenToCollection = <T,>(collectionName: string, callback: (data: T[]) => void, options: { idField?: string; orderBy?: string; direction?: 'asc' | 'desc'; }) => {
  const { idField = 'id', orderBy: orderByField, direction = 'asc' } = options;
  let q: any = collection(db, collectionName);
  if (orderByField) {
    q = query(q, orderBy(orderByField, direction));
  }
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({ ...doc.data(), [idField]: doc.id })) as T[];
    callback(data);
  }, (error) => console.error(`Error listening to ${collectionName}:`, error));
};

const addDocument = async <T extends object>(collectionName: string, data: T) => addDoc(collection(db, collectionName), data);
const updateDocument = async (collectionName: string, id: string, data: any) => updateDoc(doc(db, collectionName, id), data);
const deleteDocument = async (collectionName: string, id: string) => deleteDoc(doc(db, collectionName, id));
const setDocument = async (collectionName: string, id: string, data: any, merge = true) => setDoc(doc(db, collectionName, id), data, { merge });
const getDocument = async (collectionName: string, id: string) => getDoc(doc(db, collectionName, id));


const addPatientDoc = (patient: Omit<Patient, 'id'>) => addDocument('patients', patient);
const updatePatientDoc = (id: string, patient: Partial<Patient>) => updateDocument('patients', id, patient);
const deletePatientDoc = (id: string) => deleteDocument('patients', id);
const addDoctorDoc = (doctor: Omit<Doctor, 'id'>) => addDocument('doctors', doctor);
const updateDoctorDoc = (id: string, doctor: Partial<Doctor>) => updateDocument('doctors', id, doctor);
const deleteDoctorDoc = (id: string) => deleteDocument('doctors', id);
const addUserDoc = (user: User) => setDocument('users', user.email, user);
const updateUserDoc = (email: string, user: Partial<User>) => updateDocument('users', email, user);
const deleteUserDoc = (email: string) => deleteDocument('users', email);
const addDataFieldDoc = (field: Omit<DataField, 'id'>) => addDocument('dataFields', field);
const updateDataFieldDoc = (id: string, field: Partial<DataField>) => updateDocument('dataFields', id, field);
const deleteDataFieldDoc = (id: string) => deleteDocument('dataFields', id);
const addMessageDoc = (message: Omit<Message, 'id'|'timestamp'>) => addDocument('messages', { ...message, timestamp: new Date().toISOString() });
const addAuditLogDoc = (log: Omit<AuditLog, 'id'>) => addDocument('auditLogs', log);
const addNotificationDoc = (notification: Omit<Notification, 'id'>) => addDocument('notifications', notification);
const getPermissions = async (): Promise<Record<UserRole, Permissions>> => {
    const docSnap = await getDocument('system', 'permissions');
    return docSnap.exists() ? docSnap.data() as Record<UserRole, Permissions> : {} as Record<UserRole, Permissions>;
};
const updatePermissions = async (permissions: Partial<Record<UserRole, Permissions>>) => setDocument('system', 'permissions', permissions);
const checkUserExists = async (email: string): Promise<boolean> => (await getDocument('users', email)).exists();


export function AppProvider({ children }: { children: ReactNode }) {
    // Auth State
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Main Data State
    const [patients, setPatients] = useState<Patient[]>([]);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [permissions, setPermissions] = useState<Record<UserRole, Permissions>>({} as Record<UserRole, Permissions>);
    const [dataFields, setDataFields] = useState<DataField[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Dialog States
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [patientDialogOptions, setPatientDialogOptions] = useState<PatientDialogOptions | undefined>();

    const { toast } = useToast();

    // --- Audit Log Helper ---
    const addAuditLog = useCallback(async (action: AuditLogAction, category: AuditLogCategory, details: string) => {
        if (!currentUser) return;
        try {
            await addAuditLogDoc({
                action,
                category,
                details,
                user: { name: currentUser.name, avatar: currentUser.avatar },
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error("Failed to add audit log:", error);
        }
    }, [currentUser]);
    
    // --- Auth Logic ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true);
            if (user) {
                setFirebaseUser(user);
                try {
                    const userDoc = await getDocument('users', user.email!);
                    if (userDoc.exists()) {
                        setCurrentUser({ email: user.email!, ...userDoc.data() } as User);
                    } else {
                        setCurrentUser(null);
                        await signOut(auth); // Log out if user doc doesn't exist
                    }
                } catch (error) {
                    console.error("Error fetching user document:", error);
                    setCurrentUser(null);
                }
            } else {
                setFirebaseUser(null);
                setCurrentUser(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
      await signInWithEmailAndPassword(auth, email, pass);
      await addAuditLog('Login', 'User', `User ${email} logged in.`);
    };
  
    const logout = async () => {
      await signOut(auth);
    };

    // --- Data Seeding ---
    const seedInitialData = useCallback(async () => {
        const adminEmail = "Asd19082@gmail.com";
        const adminPassword = "159632Asd";
        try {
            const userInDb = await checkUserExists(adminEmail);
            if (!userInDb) {
                console.log("Admin user does not exist, creating...");
                await addUser({ name: "Admin", email: adminEmail, role: 'Admin', password: adminPassword });
                console.log("Admin user created successfully.");
            }
        } catch (error) { console.error("Error seeding admin user:", error); }

        const permsDoc = await getDocument("system", "permissions");
        if (!permsDoc.exists()) {
            console.log("Permissions not set, seeding default permissions...");
            const defaultPermissions: Record<UserRole, Permissions> = {
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
                    appointments: { add: true, edit: true, delete: true, cancel: true },
                    users: { add: false, edit: false, delete: false },
                },
            };
            await setDocument("system", "permissions", defaultPermissions);
        }
    }, []);

    useEffect(() => {
        seedInitialData();
    }, [seedInitialData]);


    // --- Real-time Data Fetching ---
    useEffect(() => {
        if (!currentUser) return;
        const unsubscribers = [
            listenToCollection('patients', setPatients, { orderBy: 'lastVisit', direction: 'desc' }),
            listenToCollection('doctors', setDoctors, { orderBy: 'name' }),
            listenToCollection('users', (data: User[]) => {
                setUsers(data.map(u => ({ id: u.email, ...u })));
            }, { idField: 'email' }),
            listenToCollection('dataFields', setDataFields, {}),
            listenToCollection('messages', setMessages, { orderBy: 'timestamp', direction: 'asc' }),
            listenToCollection('auditLogs', setAuditLogs, { orderBy: 'timestamp', direction: 'desc' }),
            listenToCollection('notifications', setNotifications, { orderBy: 'timestamp', direction: 'desc' })
        ];
        
        getPermissions().then(setPermissions);

        return () => unsubscribers.forEach(unsubscribe => unsubscribe());
    }, [currentUser]);

    // --- Actions (Patients, Doctors, etc.) ---
    const addPatient: AddPatientFunction = useCallback(async (patient) => {
        try {
            await addPatientDoc({ ...patient, avatar: `https://placehold.co/100x100?text=${patient.name.charAt(0)}`, lastVisit: new Date().toISOString().split('T')[0] });
            toast({ title: "تمت الإضافة بنجاح", description: `تمت إضافة المريض ${patient.name}.` });
            await addAuditLog('Create', 'Patient', `Created patient: ${patient.name}`);
            await addNotificationDoc({
                title: 'مريض جديد',
                description: `تم إضافة المريض ${patient.name} إلى النظام.`,
                type: 'new_patient',
                read: false,
                timestamp: new Date().toISOString()
            });
        } catch(e) { toast({ title: "خطأ", description: "فشل إضافة المريض.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const updatePatient: UpdatePatientFunction = useCallback(async (p) => {
        try { 
            await updatePatientDoc(p.id, p); 
            toast({ title: "تم التحديث بنجاح", description: `تم تحديث بيانات المريض ${p.name}.` });
            await addAuditLog('Update', 'Patient', `Updated patient: ${p.name}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل تحديث المريض.", variant: "destructive" }); }
    }, [toast, addAuditLog]);
    
    const deletePatient: DeletePatientFunction = useCallback(async (id) => {
        const patientName = patients.find(p => p.id === id)?.name || `ID: ${id}`;
        try { 
            await deletePatientDoc(id); 
            toast({ title: "تم الحذف بنجاح", variant: "default" }); 
            await addAuditLog('Delete', 'Patient', `Deleted patient: ${patientName}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل حذف المريض.", variant: "destructive" }); }
    }, [toast, addAuditLog, patients]);

    const addDoctor: AddDoctorFunction = useCallback(async (doctor) => {
        try { 
            await addDoctorDoc({ ...doctor, avatar: `https://placehold.co/100x100?text=${doctor.name.charAt(0)}` }); 
            toast({ title: "تمت الإضافة بنجاح", description: `تمت إضافة الطبيب ${doctor.name}.` });
            await addAuditLog('Create', 'Doctor', `Created doctor: ${doctor.name}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل إضافة الطبيب.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const updateDoctor: UpdateDoctorFunction = useCallback(async (d) => {
        try { 
            await updateDoctorDoc(d.id, d); 
            toast({ title: "تم التحديث بنجاح", description: `تم تحديث بيانات الطبيب ${d.name}.` });
            await addAuditLog('Update', 'Doctor', `Updated doctor: ${d.name}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل تحديث الطبيب.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const deleteDoctor: DeleteDoctorFunction = useCallback(async (id) => {
        const doctorName = doctors.find(d => d.id === id)?.name || `ID: ${id}`;
        try { 
            await deleteDoctorDoc(id); 
            toast({ title: "تم الحذف بنجاح", variant: "default" }); 
            await addAuditLog('Delete', 'Doctor', `Deleted doctor: ${doctorName}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل حذف الطبيب.", variant: "destructive" }); }
    }, [toast, addAuditLog, doctors]);

    const addUser: AddUserFunction = useCallback(async (user) => {
        try {
            await createUserWithEmailAndPassword(auth, user.email, user.password!);
            await addUserDoc({ ...user, avatar: `https://placehold.co/100x100?text=${user.name.charAt(0)}`, status: 'offline' }); 
            toast({ title: "تمت الإضافة بنجاح" });
            await addAuditLog('Create', 'User', `Created user: ${user.name} (${user.email})`);
        }
        catch(e: any) { 
            if (e.code === 'auth/email-already-in-use') {
                 toast({ title: "خطأ", description: "هذا البريد الإلكتروني مستخدم بالفعل.", variant: "destructive" }); 
            } else {
                 toast({ title: "خطأ", description: "فشل إضافة المستخدم.", variant: "destructive" }); 
                 throw e;
            }
        }
    }, [toast, addAuditLog]);
    
    const updateUser: UpdateUserFunction = useCallback(async (u) => {
        try { 
            const { password, ...userData } = u;
            await updateUserDoc(u.email, userData);
            toast({ title: "تم التحديث بنجاح" }); 
            await addAuditLog('Update', 'User', `Updated user: ${u.name}`);
        }
        catch (e) { toast({ title: "خطأ", description: "فشل تحديث المستخدم.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const deleteUser: DeleteUserFunction = useCallback(async (email) => {
        const userName = users.find(u => u.email === email)?.name || email;
        try { 
            await deleteUserDoc(email); 
            toast({ title: "تم الحذف بنجاح", variant: "default" });
            await addAuditLog('Delete', 'User', `Deleted user: ${userName}`);
        }
        catch (e) { toast({ title: "خطأ", description: "فشل حذف المستخدم. (قد يتطلب حذف المصادقة يدوياً)", variant: "destructive" }); }
    }, [toast, addAuditLog, users]);

    const updatePermission: UpdatePermissionFunction = useCallback(async (role, section, action, value) => {
        const newPerms = { ...permissions, [role]: { ...permissions[role], [section]: { ...permissions[role][section], [action]: value } } };
        const oldPermissions = { ...permissions };
        setPermissions(newPerms);
        try { 
            await updatePermissions({ [role]: newPerms[role] }); 
            await addAuditLog('Update', 'System', `Updated permissions for role ${role}: ${section}.${String(action)} to ${value}`);
        }
        catch(e) { setPermissions(oldPermissions); toast({ title: "خطأ", description: "فشل تحديث الصلاحيات.", variant: "destructive" }); }
    }, [permissions, toast, addAuditLog]);

    const addDataField: AddDataFieldFunction = useCallback(async (field) => {
        try { 
            await addDataFieldDoc({ ...field, type: 'مخصص' as const }); 
            toast({ title: "تمت إضافة الحقل بنجاح" }); 
            await addAuditLog('Create', 'System', `Created data field: ${field.label}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل إضافة الحقل.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const updateDataField: UpdateDataFieldFunction = useCallback(async (field) => {
        try { 
            await updateDataFieldDoc(field.id, field); 
            toast({ title: "تم تحديث الحقل بنجاح" }); 
            await addAuditLog('Update', 'System', `Updated data field: ${field.label}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل تحديث الحقل.", variant: "destructive" }); }
    }, [toast, addAuditLog]);

    const deleteDataField: DeleteDataFieldFunction = useCallback(async (id) => {
        const fieldLabel = dataFields.find(f => f.id === id)?.label || `ID: ${id}`;
        try { 
            await deleteDataFieldDoc(id); 
            toast({ title: "تم حذف الحقل بنجاح", variant: "default" });
            await addAuditLog('Delete', 'System', `Deleted data field: ${fieldLabel}`);
        }
        catch(e) { toast({ title: "خطأ", description: "فشل حذف الحقل.", variant: "destructive" }); }
    }, [toast, addAuditLog, dataFields]);
    
    const addMessage: AddMessageFunction = useCallback(async (message) => {
        try { await addMessageDoc(message); }
        catch (e) { toast({ title: "خطأ", description: "فشل إرسال الرسالة.", variant: "destructive" }); }
    }, [toast]);

    // --- Dialog Triggers ---
    const openNewPatientDialog = useCallback((options?: PatientDialogOptions) => { setPatientDialogOptions(options); setPatientDialogOpen(true); }, []);

    // --- Context Value ---
    const value: AppContextType = {
        loading, currentUser, login, logout,
        patients, doctors, users, permissions, dataFields, messages, auditLogs, notifications,
        openNewPatientDialog, addPatient, updatePatient, deletePatient,
        addDoctor, updateDoctor, deleteDoctor,
        addUser, updateUser, deleteUser, updatePermission,
        addDataField, updateDataField, deleteDataField, addMessage,
    };
    
    return (
        <AppContext.Provider value={value}>
            {children}
            <AddPatientDialog open={isPatientDialogOpen} onOpenChange={setPatientDialogOpen} initialName={patientDialogOptions?.initialName} />
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
