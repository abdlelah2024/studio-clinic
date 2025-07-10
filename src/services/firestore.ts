import { db } from "@/lib/firebase";
import type { Patient, Doctor, Appointment, User, DataField, Permissions, UserRole, Message, AuditLog, Notification } from "@/lib/types";
import {
  collection,
  getDocs,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  getDoc,
  setDoc,
  onSnapshot,
  Query,
  DocumentData,
  serverTimestamp,
} from "firebase/firestore";

// Generic function to listen to a collection with optional ordering
export const listenToCollection = <T>(
  collectionName: string,
  callback: (data: T[]) => void,
  options: {
    idField?: string;
    orderBy?: string;
    direction?: 'asc' | 'desc';
  }
): (() => void) => {
  const { idField = 'id', orderBy: orderByField, direction = 'asc' } = options;

  let q: Query<DocumentData> = collection(db, collectionName);

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
export const addPatient = (patient: Omit<Patient, 'id'>) => addDocument('patients', patient);
export const updatePatient = (id: string, patient: Partial<Patient>) => updateDocument('patients', id, patient);
export const deletePatient = (id: string) => deleteDocument('patients', id);

export const addDoctor = (doctor: Omit<Doctor, 'id'>) => addDocument('doctors', doctor);
export const updateDoctor = (id: string, doctor: Partial<Doctor>) => updateDocument('doctors', id, doctor);
export const deleteDoctor = (id: string) => deleteDocument('doctors', id);

export const addAppointment = (appointment: Omit<Appointment, 'id'>) => addDocument('appointments', appointment);
export const updateAppointment = (id: string, appointment: Partial<Appointment>) => updateDocument('appointments', id, appointment);
export const deleteAppointment = (id: string) => deleteDocument('appointments', id);

export const addUser = (user: User) => setDoc(doc(db, "users", user.email), user);
export const updateUser = (email: string, user: Partial<User>) => updateDocument('users', email, user);
export const deleteUser = (email: string) => deleteDocument('users', email);

export const addDataField = (field: Omit<DataField, 'id'>) => addDocument('dataFields', field);
export const updateDataField = (id: string, field: Partial<DataField>) => updateDocument('dataFields', id, field);
export const deleteDataField = (id: string) => deleteDocument('dataFields', id);

export const addMessage = (message: Omit<Message, 'id'|'timestamp'> & { timestamp?: any }) => {
    message.timestamp = serverTimestamp();
    return addDocument('messages', message);
};

export const addAuditLog = (log: Omit<AuditLog, 'id'|'timestamp'> & { timestamp?: any }) => {
    log.timestamp = serverTimestamp();
    return addDocument('auditLogs', log);
}

export const addNotification = (notification: Omit<Notification, 'id'|'timestamp'> & { timestamp?: any }) => {
    notification.timestamp = serverTimestamp();
    return addDocument('notifications', notification);
};


export const getPermissions = async (): Promise<Record<UserRole, Permissions>> => {
    const docRef = doc(db, 'system', 'permissions');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Record<UserRole, Permissions>;
    } else {
        console.warn("Permissions document not found, returning empty object.");
        return {} as Record<UserRole, Permissions>;
    }
};

export const updatePermissions = async (permissions: Partial<Record<UserRole, Permissions>>) => {
    const docRef = doc(db, 'system', 'permissions');
    await setDoc(docRef, permissions, { merge: true });
};
