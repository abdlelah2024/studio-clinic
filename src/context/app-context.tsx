
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient, Doctor } from "@/lib/types"
import { mockPatients, mockDoctors, mockAppointments } from "@/lib/data"
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

interface AppointmentDialogOptions {
    initialPatientId?: string;
}

interface AppContextType {
  // Data
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  
  // Enriched Data
  enrichedAppointments: (Appointment & { patient: Patient; doctor: Doctor; })[];

  // Patient Actions
  openNewPatientDialog: (onPatientAdded?: AddPatientFunction) => void;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    // Main Data State
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);

    // Dialog States
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions | null>(null);
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [onPatientAddedCallback, setOnPatientAddedCallback] = useState<AddPatientFunction | null>(null);

    const { toast } = useToast();

    // --- Memoized Enriched Data ---
    const enrichedAppointments = useMemo(() => {
        return appointments.map(appointment => {
            const patient = patients.find(p => p.id === appointment.patientId)!;
            const doctor = doctors.find(d => d.id === appointment.doctorId)!;
            return { ...appointment, patient, doctor };
        }).filter(Boolean) as (Appointment & { patient: Patient; doctor: Doctor; })[];
    }, [appointments, patients, doctors]);


    // --- Patient Actions ---
    const addPatient: AddPatientFunction = useCallback((patient) => {
        const newPatient: Patient = {
            ...patient,
            id: `p${patients.length + 1}`,
            avatar: `https://placehold.co/100x100?text=${patient.name.charAt(0)}`,
            lastVisit: new Date().toISOString().split('T')[0],
        };
        setPatients(prev => [newPatient, ...prev]);
        if (onPatientAddedCallback) {
            onPatientAddedCallback(patient);
        }
        toast({
            title: "تمت الإضافة بنجاح",
            description: `تمت إضافة المريض ${patient.name} إلى السجلات.`,
        });
    }, [patients.length, onPatientAddedCallback, toast]);

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

    const openNewPatientDialog = useCallback((onPatientAdded?: AddPatientFunction) => {
        setOnPatientAddedCallback(() => onPatientAdded || (() => {}));
        setPatientDialogOpen(true);
    }, []);

    // --- Doctor Actions ---
    const addDoctor: AddDoctorFunction = useCallback((doctor) => {
        const newDoctor: Doctor = {
          ...doctor,
          id: `d${doctors.length + 1}`,
          avatar: `https://placehold.co/100x100?text=${doctor.name.charAt(0)}`,
        };
        setDoctors(prev => [newDoctor, ...prev]);
        toast({
          title: "تمت الإضافة بنجاح",
          description: `تمت إضافة الطبيب ${doctor.name}.`,
        });
    }, [doctors.length, toast]);

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
            id: `a${appointments.length + 1}`,
        };
        setAppointments(prev => [newAppointment, ...prev]);
        const patientName = patients.find(p => p.id === appointment.patientId)?.name || "Unknown Patient";
        const doctorName = doctors.find(d => d.id === appointment.doctorId)?.name || "Unknown Doctor";
        toast({
            title: "تمت جدولة الموعد بنجاح",
            description: `تم حجز موعد لـ ${patientName} مع ${doctorName}.`,
        });
    }, [appointments.length, patients, doctors, toast]);

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

    const value: AppContextType = {
        patients,
        doctors,
        appointments,
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
    };

    return (
        <AppContext.Provider value={value}>
            {children}
            <NewAppointmentDialog
                open={isAppointmentDialogOpen}
                onOpenChange={setAppointmentDialogOpen}
                onAppointmentAdded={addAppointment}
                initialPatientId={appointmentDialogOptions?.initialPatientId}
            />
            <AddPatientDialog
                open={isPatientDialogOpen}
                onOpenChange={setPatientDialogOpen}
                onPatientAdded={addPatient}
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
