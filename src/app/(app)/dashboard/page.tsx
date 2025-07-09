
"use client"
import React, { useState, useMemo } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentCalendar } from "@/components/dashboard/appointment-calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockAppointments } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, startOfDay } from 'date-fns';

type TimeRange = 'all' | '7d' | '30d';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');

  const getStatusTranslation = (status: 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting') => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      case 'Waiting': return 'منتظر';
      default: return status;
    }
  }

  const filteredData = useMemo(() => {
    const now = startOfDay(new Date());
    let startDate: Date | null = null;

    if (timeRange === '7d') {
      startDate = addDays(now, -7);
    } else if (timeRange === '30d') {
      startDate = addDays(now, -30);
    }

    const appointments = mockAppointments.filter(appointment => {
      if (!startDate) return true;
      const appointmentDate = startOfDay(new Date(appointment.date));
      return appointmentDate >= startDate && appointmentDate <= now;
    });

    const upcomingAppointments = mockAppointments
      .filter(a => (a.status === 'Scheduled' || a.status === 'Waiting') && new Date(a.date) >= now)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    return { appointments, upcomingAppointments };
  }, [timeRange]);

  return (
    <div className="flex flex-col gap-6">
       <div className="flex justify-end">
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
              <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="اختر نطاقًا زمنيًا" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="all">كل الأوقات</SelectItem>
                  <SelectItem value="30d">آخر 30 يومًا</SelectItem>
                  <SelectItem value="7d">آخر 7 أيام</SelectItem>
              </SelectContent>
          </Select>
       </div>

      <StatsCards appointments={filteredData.appointments} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <AppointmentCalendar />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>المواعيد القادمة</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>المريض</TableHead>
                    <TableHead>الوقت</TableHead>
                    <TableHead>الحالة</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.upcomingAppointments.length > 0 ? filteredData.upcomingAppointments.map((appointment) => (
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
                      <TableCell>{appointment.startTime}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getStatusTranslation(appointment.status)}</Badge>
                      </TableCell>
                    </TableRow>
                  )) : (
                     <TableRow>
                        <TableCell colSpan={3} className="h-24 text-center">
                            لا توجد مواعيد قادمة.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
