
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient } from "@/lib/types"
import { mockPatients } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"

type AddAppointmentFunction = (appointment: Omit<Appointment, 'id' | 'patientId' | 'doctorId' > & { patientName: string, doctorName: string, status: 'Scheduled' }) => void;
type AddPatientFunction = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => void;

interface AppointmentDialogOptions {
    initialPatientName?: string;
    onAppointmentAdded: AddAppointmentFunction;
}

interface AppContextType {
  openNewAppointmentDialog: (options: AppointmentDialogOptions) => void;
  openNewPatientDialog: (onPatientAdded: AddPatientFunction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions | null>(null);
    
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const [onPatientAddedCallback, setOnPatientAddedCallback] = useState<AddPatientFunction | null>(null);

    const { toast } = useToast();

    const openNewAppointmentDialog = useCallback((options: AppointmentDialogOptions) => {
        setAppointmentDialogOptions(options);
        setAppointmentDialogOpen(true);
    }, []);
    
    const openNewPatientDialog = useCallback((onPatientAdded: AddPatientFunction) => {
        setOnPatientAddedCallback(() => onPatientAdded);
        setPatientDialogOpen(true);
    }, []);

    const handleAppointmentAdded: AddAppointmentFunction = (appointment) => {
        if(appointmentDialogOptions?.onAppointmentAdded) {
            appointmentDialogOptions.onAppointmentAdded(appointment);
        } else {
             // Fallback if no callback provided
            console.log("Appointment Added (Context Fallback):", appointment);
            toast({
                title: "تمت جدولة الموعد بنجاح",
                description: `تم حجز موعد لـ ${appointment.patientName}.`,
            });
        }
    };
    
    const handlePatientAdded: AddPatientFunction = (patient) => {
        if(onPatientAddedCallback) {
            onPatientAddedCallback(patient);
        } else {
            // Fallback if no callback provided
            console.log("Patient Added (Context Fallback):", patient);
            toast({
                title: "تمت الإضافة بنجاح",
                description: `تمت إضافة المريض ${patient.name} إلى السجلات.`,
            });
        }
    }

    return (
        <AppContext.Provider value={{ openNewAppointmentDialog, openNewPatientDialog }}>
            {children}
            {appointmentDialogOptions && (
                <NewAppointmentDialog
                    open={isAppointmentDialogOpen}
                    onOpenChange={setAppointmentDialogOpen}
                    patients={mockPatients}
                    onAppointmentAdded={handleAppointmentAdded}
                    initialPatientName={appointmentDialogOptions.initialPatientName}
                />
            )}
            <AddPatientDialog
                open={isPatientDialogOpen}
                onOpenChange={setPatientDialogOpen}
                onPatientAdded={handlePatientAdded}
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
