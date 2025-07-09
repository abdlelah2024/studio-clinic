
"use client"
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import type { Appointment, Patient } from "@/lib/types"
import { mockPatients } from "@/lib/data"
import { useToast } from "@/hooks/use-toast"


interface AppointmentDialogOptions {
    initialPatientName?: string;
}

interface AppContextType {
  openNewAppointmentDialog: (options: AppointmentDialogOptions) => void;
  openNewPatientDialog: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isAppointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
    const [appointmentDialogOptions, setAppointmentDialogOptions] = useState<AppointmentDialogOptions>({});
    const [isPatientDialogOpen, setPatientDialogOpen] = useState(false);
    const { toast } = useToast();

    const openNewAppointmentDialog = useCallback((options: AppointmentDialogOptions) => {
        setAppointmentDialogOptions(options);
        setAppointmentDialogOpen(true);
    }, []);
    
    const openNewPatientDialog = useCallback(() => {
        setPatientDialogOpen(true);
    }, []);

    const handleAppointmentAdded = (appointment: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'status'> & { patientName: string, doctorName: string }) => {
        // In a real app, this would likely trigger a mutation/refetch.
        console.log("Appointment Added:", appointment);
        toast({
            title: "تمت جدولة الموعد بنجاح",
            description: `تم حجز موعد لـ ${appointment.patientName}.`,
        });
    };
    
    const handlePatientAdded = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => {
        // In a real app, this would likely trigger a mutation/refetch.
        console.log("Patient Added:", patient);
        toast({
            title: "تمت الإضافة بنجاح",
            description: `تمت إضافة المريض ${patient.name} إلى السجلات.`,
        });
    }

    return (
        <AppContext.Provider value={{ openNewAppointmentDialog, openNewPatientDialog }}>
            {children}
            <NewAppointmentDialog
                open={isAppointmentDialogOpen}
                onOpenChange={setAppointmentDialogOpen}
                patients={mockPatients}
                onAppointmentAdded={handleAppointmentAdded}
                initialPatientName={appointmentDialogOptions.initialPatientName}
            />
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
