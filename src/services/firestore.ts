import { db } from "@/lib/firebase";
import type { Patient, Doctor, Appointment, User, DataField, Permissions, UserRole } from "@/lib/types";
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
} from "firebase/firestore";

// Generic function to fetch a collection
const getCollection = async <T>(collectionName: string, idField = 'id'): Promise<T[]> => {
  const q = query(collection(db, collectionName));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ [idField]: doc.id, ...doc.data() } as T));
};

// Generic function to fetch a collection with ordering
const getCollectionOrdered = async <T>(collectionName: string, idField = 'id', orderByField: string, orderDirection: 'asc' | 'desc' = 'asc'): Promise<T[]> => {
  const q = query(collection(db, collectionName), orderBy(orderByField, orderDirection));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ [idField]: doc.id, ...doc.data() } as T));
};


// Generic function to add a document
const addDocument = async <T>(collectionName: string, data: T) => {
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
export const getPatients = () => getCollectionOrdered<Patient>('patients', 'id', 'lastVisit', 'desc');
export const addPatient = (patient: Omit<Patient, 'id'>) => addDocument('patients', patient);
export const updatePatient = (id: string, patient: Partial<Patient>) => updateDocument('patients', id, patient);
export const deletePatient = (id: string) => deleteDocument('patients', id);

export const getDoctors = () => getCollectionOrdered<Doctor>('doctors', 'id', 'name', 'asc');
export const addDoctor = (doctor: Omit<Doctor, 'id'>) => addDocument('doctors', doctor);
export const updateDoctor = (id: string, doctor: Partial<Doctor>) => updateDocument('doctors', id, doctor);
export const deleteDoctor = (id: string) => deleteDocument('doctors', id);

export const getAppointments = () => getCollectionOrdered<Appointment>('appointments', 'id', 'date', 'desc');
export const addAppointment = (appointment: Omit<Appointment, 'id'>) => addDocument('appointments', appointment);
export const updateAppointment = (id: string, appointment: Partial<Appointment>) => updateDocument('appointments', id, appointment);
export const deleteAppointment = (id: string) => deleteDocument('appointments', id);

export const getUsers = () => getCollection<User>('users', 'email');
export const addUser = (user: User) => setDoc(doc(db, "users", user.email), user);
export const updateUser = (email: string, user: Partial<User>) => updateDocument('users', email, user);
export const deleteUser = (email: string) => deleteDocument('users', email);

export const getDataFields = () => getCollection<DataField>('dataFields');
export const addDataField = (field: Omit<DataField, 'id'>) => addDocument('dataFields', field);
export const updateDataField = (id: string, field: Partial<DataField>) => updateDocument('dataFields', id, field);
export const deleteDataField = (id: string) => deleteDocument('dataFields', id);

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

export const updatePermissions = async (permissions: Record<UserRole, Permissions>) => {
    const docRef = doc(db, 'system', 'permissions');
    await setDoc(docRef, permissions, { merge: true });
};
