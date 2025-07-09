
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockAppointments, mockPatients, mockDoctors } from "@/lib/data"
import type { Appointment } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, ListFilter, Edit, Trash2, Clock, XCircle } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RescheduleAppointmentDialog } from "@/components/appointments/reschedule-appointment-dialog"
import { useToast } from "@/hooks/use-toast"
import { useAppContext } from "@/context/app-context"


type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filter, setFilter] = useState<AppointmentStatus | 'All'>('All');
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>(undefined);
  const { toast } = useToast();
  const { openNewAppointmentDialog } = useAppContext();

  const handleAddAppointment = (newAppointmentData: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'status'> & { patientName: string, doctorName: string }) => {
    const patient = mockPatients.find(p => p.name === newAppointmentData.patientName);
    const doctor = mockDoctors.find(d => d.name === newAppointmentData.doctorName);

    if (!patient || !doctor) {
        toast({ title: "خطأ", description: "لم يتم العثور على المريض أو الطبيب.", variant: "destructive" });
        return;
    }

    const newAppointment: Appointment = {
      ...newAppointmentData,
      id: `a${appointments.length + 1}`,
      patient: { name: patient.name, avatar: patient.avatar },
      doctor: { name: doctor.name, avatar: doctor.avatar },
      status: 'Scheduled',
    };
    setAppointments(prev => [newAppointment, ...prev]);
    toast({
        title: "تمت جدولة الموعد بنجاح",
        description: `تم حجز موعد لـ ${patient.name} مع ${doctor.name}.`,
    });
  };
  
  const handleRescheduleAppointment = (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    setAppointments(prev => prev.map(app => 
      app.id === appointmentId 
        ? { ...app, date: newDate, startTime: newStartTime, endTime: newEndTime } 
        : app
    ));
    toast({
        title: "تمت إعادة الجدولة بنجاح",
        description: `تم تحديث الموعد.`,
    });
  };

  const handleCancelAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.map(app => 
        app.id === appointmentId ? { ...app, status: 'Canceled' } : app
    ));
    toast({
      title: "تم إلغاء الموعد",
      variant: "destructive"
    });
  };

  const handleDeleteAppointment = (appointmentId: string) => {
     setAppointments(prev => prev.filter(app => app.id !== appointmentId));
     toast({
      title: "تم حذف الموعد",
      variant: "destructive"
    });
  }

  const getStatusTranslation = (status: AppointmentStatus) => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      default: return status;
    }
  }

  const filteredAppointments = appointments.filter(appointment => 
    filter === 'All' || appointment.status === filter
  );

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
                  <DropdownMenuItem onSelect={() => setFilter('All')}>الكل</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Scheduled')}>مجدول</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Completed')}>مكتمل</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Canceled')}>ملغى</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-1" onClick={() => openNewAppointmentDialog({})}>
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
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
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
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => {
                          setSelectedAppointment(appointment);
                          setIsRescheduleDialogOpen(true);
                        }}>
                          <Clock className="mr-2 h-4 w-4" />
                          إعادة جدولة
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleCancelAppointment(appointment.id)}>
                            <XCircle className="mr-2 h-4 w-4" />
                            إلغاء
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onSelect={() => handleDeleteAppointment(appointment.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
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
