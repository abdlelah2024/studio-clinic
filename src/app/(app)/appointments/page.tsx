
"use client"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import type { Appointment, AppointmentStatus, Patient, Doctor } from "@/lib/types"
import { MoreHorizontal, PlusCircle, Search, Calendar, Edit, Trash2, XCircle, CheckCircle, Clock, Undo2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"
import { RescheduleAppointmentDialog } from "@/components/appointments/reschedule-appointment-dialog"
import { DeleteAppointmentDialog } from "@/components/appointments/delete-appointment-dialog"
import { useAppContext } from "@/context/app-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Combobox } from "@/components/ui/combobox"

const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      case 'Canceled': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
      case 'Return': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
      case 'Waiting': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
}

const getStatusIcon = (status: AppointmentStatus) => {
    switch (status) {
        case 'Scheduled': return <Calendar className="h-3.5 w-3.5" />;
        case 'Completed': return <CheckCircle className="h-3.5 w-3.5" />;
        case 'Canceled': return <XCircle className="h-3.5 w-3.5" />;
        case 'Return': return <Undo2 className="h-3.5 w-3.5" />;
        case 'Waiting': return <Clock className="h-3.5 w-3.5" />;
        default: return <Calendar className="h-3.5 w-3.5" />;
    }
}


export default function AppointmentsPage() {
  const { 
    enrichedAppointments, 
    patients, 
    doctors, 
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    openNewPatientDialog
  } = useAppContext();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [doctorFilter, setDoctorFilter] = useState<string>('all');
  const [patientFilter, setPatientFilter] = useState<string>('all');

  const filteredAndSortedAppointments = useMemo(() => {
    return enrichedAppointments.filter(app => {
        const searchMatch = app.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            app.reason.toLowerCase().includes(searchQuery.toLowerCase());
        const statusMatch = statusFilter === 'all' || app.status === statusFilter;
        const doctorMatch = doctorFilter === 'all' || app.doctorId === doctorFilter;
        const patientMatch = patientFilter === 'all' || app.patientId === patientFilter;
        return searchMatch && statusMatch && doctorMatch && patientMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [enrichedAppointments, searchQuery, statusFilter, doctorFilter, patientFilter]);

  if (loading) {
      return (
        <Card>
            <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </CardContent>
        </Card>
      )
  }

  const patientOptions = patients.map(p => ({ value: p.id, label: p.name }));
  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.name }));

  const handleStatusChange = (appointment: Appointment, status: AppointmentStatus) => {
      updateAppointment({ ...appointment, status });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>إدارة المواعيد</CardTitle>
            <CardDescription>عرض وجدولة وإدارة جميع المواعيد.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
             <NewAppointmentDialog
              patients={patients}
              doctors={doctors}
              onAppointmentAdded={addAppointment}
              openNewPatientDialog={openNewPatientDialog}
            >
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  موعد جديد
                </span>
              </Button>
            </NewAppointmentDialog>
          </div>
        </div>
         <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="البحث بالاسم، الطبيب، أو السبب..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="فلترة بالحالة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">كل الحالات</SelectItem>
                    <SelectItem value="Scheduled">مجدول</SelectItem>
                    <SelectItem value="Return">عودة</SelectItem>
                    <SelectItem value="Waiting">منتظر</SelectItem>
                    <SelectItem value="Completed">مكتمل</SelectItem>
                    <SelectItem value="Canceled">ملغي</SelectItem>
                </SelectContent>
            </Select>
            <div className="w-full md:w-[180px]">
              <Combobox
                  options={doctorOptions}
                  selectedValue={doctorFilter === 'all' ? '' : doctorFilter}
                  onSelectedValueChange={(val) => setDoctorFilter(val || 'all')}
                  placeholder="اختر طبيباً..."
                  searchPlaceholder="بحث عن طبيب..."
                  noResultsText="لم يتم العثور على طبيب."
              />
            </div>
             <div className="w-full md:w-[180px]">
              <Combobox
                  options={patientOptions}
                  selectedValue={patientFilter === 'all' ? '' : patientFilter}
                  onSelectedValueChange={(val) => setPatientFilter(val || 'all')}
                  placeholder="اختر مريضاً..."
                  searchPlaceholder="بحث عن مريض..."
                  noResultsText="لم يتم العثور على مريض."
              />
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المريض</TableHead>
              <TableHead>الطبيب</TableHead>
              <TableHead>التاريخ والوقت</TableHead>
              <TableHead>السبب</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>التكلفة</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} data-ai-hint="person face" />
                      <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{appointment.patient.name}</div>
                  </div>
                </TableCell>
                <TableCell>{appointment.doctor.name}</TableCell>
                <TableCell>{format(new Date(appointment.date), 'yyyy-MM-dd')} @ {appointment.startTime}</TableCell>
                <TableCell>{appointment.reason}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Badge className={cn("cursor-pointer gap-1.5", getStatusColor(appointment.status))} >
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                      </Badge>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>تغيير الحالة</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {(['Scheduled', 'Return', 'Waiting', 'Completed', 'Canceled'] as AppointmentStatus[]).map(status => (
                             <DropdownMenuItem key={status} onSelect={() => handleStatusChange(appointment, status)}>
                                {status}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell>{appointment.cost ? `${appointment.cost} ر.ي` : '-'}</TableCell>
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
                      <RescheduleAppointmentDialog appointment={appointment} onAppointmentUpdated={updateAppointment}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            إعادة جدولة
                        </DropdownMenuItem>
                      </RescheduleAppointmentDialog>
                      <DropdownMenuSeparator />
                       <DeleteAppointmentDialog appointment={appointment} onDelete={() => deleteAppointment(appointment.id)}>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف الموعد
                        </DropdownMenuItem>
                      </DeleteAppointmentDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {filteredAndSortedAppointments.length === 0 && (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        لا توجد مواعيد تطابق بحثك.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
