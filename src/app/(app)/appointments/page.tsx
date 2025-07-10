
"use client"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import type { Appointment, Doctor, Patient } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, ListFilter, Clock, XCircle, CheckCircle2, Search, ArrowUpDown, Trash2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { RescheduleAppointmentDialog } from "@/components/appointments/reschedule-appointment-dialog"
import { useAppContext } from "@/context/app-context"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"

type EnrichedAppointment = Appointment & {
  patient: Patient;
  doctor: Doctor;
};

type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting';
type SortKey = 'date-asc' | 'date-desc';

export default function AppointmentsPage() {
  const { enrichedAppointments, updateAppointment, deleteAppointment, openNewAppointmentDialog } = useAppContext();
  const [filter, setFilter] = useState<AppointmentStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('date-desc');
  const [isRescheduleDialogOpen, setIsRescheduleDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<EnrichedAppointment | undefined>(undefined);
  
  const handleRescheduleAppointment = (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => {
    const appointmentToUpdate = enrichedAppointments.find(app => app.id === appointmentId);
    if(appointmentToUpdate) {
        updateAppointment({ ...appointmentToUpdate, date: newDate, startTime: newStartTime, endTime: newEndTime });
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    const appointmentToUpdate = enrichedAppointments.find(app => app.id === appointmentId);
     if(appointmentToUpdate) {
        updateAppointment({ ...appointmentToUpdate, status: 'Canceled' });
    }
  };

  const getStatusTranslation = (status: AppointmentStatus) => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      case 'Waiting': return 'منتظر';
      default: return status;
    }
  }

  const filteredAndSortedAppointments = useMemo(() => {
    const filtered = enrichedAppointments.filter(appointment => {
        const statusFilterMatch = filter === 'All' || appointment.status === filter;
        const searchFilterMatch = 
            appointment.patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
        return statusFilterMatch && searchFilterMatch;
    });

    return filtered.sort((a, b) => {
        switch (sortKey) {
            case 'date-asc':
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case 'date-desc':
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });
  }, [enrichedAppointments, filter, searchQuery, sortKey]);

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
               <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="البحث باسم المريض/الطبيب..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  <DropdownMenuItem onSelect={() => setFilter('Waiting')}>منتظر</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Completed')}>مكتمل</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setFilter('Canceled')}>ملغى</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      تصنيف
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>تصنيف حسب</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'date-desc'}
                        onSelect={() => setSortKey('date-desc')}
                    >
                        التاريخ (الأحدث أولاً)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'date-asc'}
                        onSelect={() => setSortKey('date-asc')}
                    >
                        التاريخ (الأقدم أولاً)
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" className="gap-1" onClick={() => openNewAppointmentDialog()}>
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
              {filteredAndSortedAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appointment.patient.avatar} data-ai-hint="person face" />
                        <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium">{appointment.patient.name}</span>
                         {appointment.freeReturn && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>عودة مجانية مفعلة</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
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
                    <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}
                      className={cn({
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 hover:bg-blue-200": appointment.status === 'Waiting',
                      })}
                    >
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
                        <DropdownMenuItem className="text-destructive" onSelect={() => deleteAppointment(appointment.id)}>
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
