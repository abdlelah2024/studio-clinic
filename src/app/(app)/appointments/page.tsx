
"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockAppointments } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, ListFilter, UserPlus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { differenceInDays, parseISO, format } from "date-fns"
import type { Patient } from "@/lib/types"

export default function AppointmentsPage() {

   const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => {
    // In a real app, you'd save this to a database and maybe refresh the appointments list
    // or select the new patient in a "New Appointment" form.
    console.log("New patient added:", newPatient);
  };

  return (
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
                <DropdownMenuItem>مجدول</DropdownMenuItem>
                <DropdownMenuItem>مكتمل</DropdownMenuItem>
                <DropdownMenuItem>ملغى</DropdownMenuItem>
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
            <Button size="sm" className="gap-1">
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
            {mockAppointments.map((appointment) => {
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
                      {appointment.status === 'Completed' ? 'مكتمل' : appointment.status === 'Canceled' ? 'ملغى' : 'مجدول'}
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
                        <DropdownMenuItem>إعادة جدولة</DropdownMenuItem>
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
  )
}
