
"use client"
import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText, Calendar as CalendarIcon, Filter, Users, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRange } from "react-day-picker"
import { addDays, format, startOfDay } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { mockAppointments, mockDoctors, mockPatients } from "@/lib/data"
import type { Appointment, Patient, Doctor } from "@/lib/types"
import { cn } from "@/lib/utils"

type AppointmentStatus = 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting';

type EnrichedAppointment = Appointment & {
  patient: Patient;
  doctor: Doctor;
};


export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfDay(addDays(new Date(), -30)),
    to: startOfDay(new Date()),
  });
  const [doctorFilter, setDoctorFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredAppointments = useMemo(() => {
     const enriched = mockAppointments.map(appointment => {
      const patient = mockPatients.find(p => p.id === appointment.patientId)!;
      const doctor = mockDoctors.find(d => d.id === appointment.doctorId)!;
      return { ...appointment, patient, doctor };
    }).filter(Boolean) as EnrichedAppointment[];

    return enriched.filter(appointment => {
      const appointmentDate = startOfDay(new Date(appointment.date));
      
      const isDateInRange = dateRange?.from && dateRange?.to ? 
          appointmentDate >= startOfDay(dateRange.from) && appointmentDate <= startOfDay(dateRange.to) : true;

      const isDoctorMatch = doctorFilter === 'all' || appointment.doctor.id === doctorFilter;
      const isStatusMatch = statusFilter === 'all' || appointment.status === statusFilter;
      
      return isDateInRange && isDoctorMatch && isStatusMatch;
    });
  }, [dateRange, doctorFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalAppointments = filteredAppointments.length;
    const completed = filteredAppointments.filter(a => a.status === 'Completed').length;
    const scheduled = filteredAppointments.filter(a => a.status === 'Scheduled').length;
    const canceled = filteredAppointments.filter(a => a.status === 'Canceled').length;
    const waiting = filteredAppointments.filter(a => a.status === 'Waiting').length;
    
    return { totalAppointments, completed, scheduled, canceled, waiting };
  }, [filteredAppointments]);

  const chartData = [
    { name: 'مكتمل', count: stats.completed, fill: "hsl(var(--primary))" },
    { name: 'مجدول', count: stats.scheduled, fill: "hsl(var(--secondary))" },
    { name: 'منتظر', count: stats.waiting, fill: "hsl(var(--chart-1))" },
    { name: 'ملغى', count: stats.canceled, fill: "hsl(var(--destructive))" },
  ];

  const getStatusTranslation = (status: AppointmentStatus) => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      case 'Waiting': return 'منتظر';
      default: return status;
    }
  }


  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>التقارير والإحصائيات</CardTitle>
              <CardDescription>تحليل بيانات العيادة مع خيارات فلترة متقدمة.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" asChild>
              <Link href="/reports/new">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  مسودة جديدة بالذكاء الاصطناعي
                </span>
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-sm font-semibold mr-4"><Filter className="inline-block w-4 h-4 mr-2"/>خيارات الفلترة</h3>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full sm:w-[300px] justify-start text-left font-normal", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                        dateRange.to ? (
                            <>
                            {format(dateRange.from, "LLL dd, y")} -{" "}
                            {format(dateRange.to, "LLL dd, y")}
                            </>
                        ) : (
                            format(dateRange.from, "LLL dd, y")
                        )
                        ) : (
                        <span>اختر تاريخ</span>
                        )}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={dateRange?.from}
                            selected={dateRange}
                            onSelect={setDateRange}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                 <Select value={doctorFilter} onValueChange={setDoctorFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="فلترة حسب الطبيب" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل الأطباء</SelectItem>
                        {mockDoctors.map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id}>{doctor.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="فلترة حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">كل الحالات</SelectItem>
                        <SelectItem value="Scheduled">مجدول</SelectItem>
                        <SelectItem value="Waiting">منتظر</SelectItem>
                        <SelectItem value="Completed">مكتمل</SelectItem>
                        <SelectItem value="Canceled">ملغى</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المواعيد</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المواعيد المكتملة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المواعيد الملغاة</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.canceled}</div>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة الإلغاء</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {stats.totalAppointments > 0 ? `${((stats.canceled / stats.totalAppointments) * 100).toFixed(1)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle>قائمة المواعيد المفصلة</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>المريض</TableHead>
                            <TableHead>الطبيب</TableHead>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الحالة</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAppointments.length > 0 ? filteredAppointments.map(appointment => (
                            <TableRow key={appointment.id}>
                                <TableCell>{appointment.patient.name}</TableCell>
                                <TableCell>{appointment.doctor.name}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>
                                     <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}
                                        className={cn({
                                            "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-300 hover:bg-blue-200": appointment.status === 'Waiting',
                                        })}
                                    >
                                        {getStatusTranslation(appointment.status)}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24">
                                    لا توجد مواعيد تطابق الفلترة المحددة.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>توزيع المواعيد حسب الحالة</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{
                                background: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "var(--radius)",
                            }}
                        />
                        <Legend />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
