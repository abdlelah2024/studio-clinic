
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockAppointments, mockDoctors, mockPatients } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, ListFilter, UserPlus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { differenceInDays, parseISO, format } from "date-fns"
import type { Patient, Appointment } from "@/lib/types"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { RescheduleAppointmentDialog } from "@/components/appointments/reschedule-appointment-dialog"
import { useToast } from "@/hooks/use-toast"

type StatusFilter = Appointment['status'] | 'All';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [filter, setFilter] = useState<StatusFilter>('All');
  const [isNewAppointmentDialogOpen, setIsNewAppointmentDialogOpen] = useState(false);
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { toast } = useToast();


  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => {
    const patientWithDefaults: Patient = {
      id: `p${patients.length + 1}`,
      ...newPatient,
      avatar: `https://placehold.co/100x100/E0E0E0/000000.png?text=${newPatient.name.charAt(0)}`,
      lastVisit: format(new Date(), 'yyyy-MM-dd')
    };
    setPatients(prev => [patientWithDefaults, ...prev]);
  };
  
  const handleAddAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'status'> & { patientName: string; doctorName: string; }) => {
    const patient = patients.find(p => p.name === newAppointmentData.patientName);
    const doctor = mockDoctors.find(d => d.name === newAppointmentData.doctorName);

    if (!patient || !doctor) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على المريض أو الطبيب.",
        variant: "destructive",
      });
      return;
    }

    const newAppointment: Appointment = {
      id: `a${appointments.length + 1}`,
      patient: { name: patient.name, avatar: patient.avatar },
      doctor: { name: doctor.name, avatar: doctor.avatar },
      date: newAppointmentData.date,
      startTime: newAppointmentData.startTime,
      endTime: newAppointmentData.endTime,
      reason: newAppointmentData.reason,
      status: 'Scheduled'
    };
    setAppointments(prev => [newAppointment, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({
        title: "تمت إضافة الموعد",
        description: `تم حجز موعد لـ ${patient.name} مع ${doctor.name}.`,
    });
  };

  const handleRescheduleAppointment = (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { ...app, date: newDate, startTime: newStartTime, endTime: newEndTime, status: 'Scheduled' }
        : app
    ));
    setSelectedAppointment(null);
     toast({
        title: "تمت إعادة الجدولة",
        description: `تم تحديث الموعد بنجاح.`,
    });
  }

  const handleOpenRescheduleDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleDialogOpen(true);
  };


  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'All') return true;
    return appointment.status === filter;
  });

  const getStatusTranslation = (status: Appointment['status']) => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      default: return status;
    }
  }

  return (
    <>
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>المواعيد</CardTitle>
            <CardDescription>إدارة وعرض جميع مواعيد المرضى.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    فلترة
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>فلترة حسب الحالة</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilter('All')}>الكل</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Scheduled')}>مجدول</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Completed')}>مكتمل</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('Canceled')}>ملغى</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AddPatientDialog onPatientAdded={handleAddPatient}>
               <Button variant="outline" size="sm" className="gap-1">
                <UserPlus className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  إضافة سريعة لمريض
                </span>
              </Button>
            </AddPatientDialog>
            <Button size="sm" className="gap-1" onClick={() => setIsNewAppointmentDialogOpen(true)}>
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  موعد جديد
                </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المريض</TableHead>
              <TableHead>الطبيب</TableHead>
              <TableHead>السبب</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الوقت</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>عودة مجانية (7 أيام)</TableHead>
              <TableHead>
                <span className="sr-only">الإجراءات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAppointments.map((appointment) => {
              const appointmentDate = parseISO(appointment.date);
              const daysSinceAppointment = differenceInDays(new Date(), appointmentDate);
              const isFreeReturn = appointment.status === 'Completed' && daysSinceAppointment >= 0 && daysSinceAppointment <= 7;

              return (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appointment.patient.avatar} data-ai-hint="person face" />
                        <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{appointment.patient.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appointment.doctor.avatar} data-ai-hint="doctor person" />
                        <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{appointment.doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.startTime}</TableCell>
                  <TableCell>
                    <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}>
                      {getStatusTranslation(appointment.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isFreeReturn ? (
                        <Badge variant="secondary">مؤهل</Badge>
                    ) : (
                        <Badge variant="outline">غير مؤهل</Badge>
                    )}
                   </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem>تعديل</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleOpenRescheduleDialog(appointment)}>إعادة جدولة</DropdownMenuItem>
                        <DropdownMenuItem>إلغاء</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">حذف</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
     <NewAppointmentDialog
        open={isNewAppointmentDialogOpen}
        onOpenChange={setIsNewAppointmentDialogOpen}
        onAppointmentAdded={handleAddAppointment}
        patients={patients}
     />
     {selectedAppointment && (
      <RescheduleAppointmentDialog
        open={isRescheduleDialogOpen}
        onOpenChange={setIsRescheduleDialogOpen}
        appointment={selectedAppointment}
        onAppointmentRescheduled={handleRescheduleAppointment}
      />
    )}
    </>
  )
}
