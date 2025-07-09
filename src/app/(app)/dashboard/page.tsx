
"use client"
import React, { useState, useMemo } from "react"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockAppointments, allUsers } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, startOfDay, isToday } from 'date-fns';
import { Wifi, Users, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

type TimeRange = 'all' | '30d' | '7d' | 'today';

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [isOnline, setIsOnline] = useState(true);
  
  // Mock browser online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    // Initial check
    setIsOnline(navigator.onLine);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);


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
    
    if (timeRange === 'today') {
      startDate = now;
    } else if (timeRange === '7d') {
      startDate = addDays(now, -7);
    } else if (timeRange === '30d') {
      startDate = addDays(now, -30);
    }

    const appointments = mockAppointments.filter(appointment => {
      const appointmentDate = startOfDay(new Date(appointment.date));
      if (timeRange === 'today') {
        return isToday(appointmentDate);
      }
      if (!startDate) return true;
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
                  <SelectItem value="today">اليوم</SelectItem>
              </SelectContent>
          </Select>
       </div>

      <StatsCards appointments={filteredData.appointments} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-6 w-6" />
                        حالة المستخدمين والنظام
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                        <TableRow>
                            <TableHead>المستخدم</TableHead>
                            <TableHead>الدور</TableHead>
                            <TableHead>الحالة</TableHead>
                        </TableRow>
                        </TableHeader>
                        <TableBody>
                        {allUsers.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="font-medium">{user.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>{user.role === 'Admin' ? 'مدير' : user.role === 'Doctor' ? 'طبيب' : 'موظف استقبال'}</TableCell>
                                <TableCell>
                                    <Badge variant={user.status === 'online' ? 'default' : 'secondary'} className={cn(user.status === 'online' && 'bg-green-500/20 text-green-700 border-green-400')}>
                                        {user.status === 'online' ? 'متصل' : 'غير متصل'}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </CardContent>
                <CardFooter className="flex justify-between text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-2">
                        <Wifi className={cn("h-4 w-4", isOnline ? "text-green-500" : "text-destructive")} />
                        <span>الاتصال بالإنترنت: {isOnline ? "متصل" : "مقطوع"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-500" />
                        <span>آخر مزامنة: الآن</span>
                    </div>
                </CardFooter>
            </Card>
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
