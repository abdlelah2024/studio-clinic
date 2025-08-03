
"use client"
import React, { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wifi, Users, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/context/app-context"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const { users, enrichedAppointments, loading } = useAppContext();
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    if (typeof window !== 'undefined') {
        setIsOnline(navigator.onLine);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);

  const todaysAppointments = useMemo(() => {
    if (loading) return [];
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return enrichedAppointments
      .filter(app => app.date === todayStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [enrichedAppointments, loading]);
  
  if (loading) {
      return (
          <div className="flex flex-col gap-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
                  <Skeleton className="h-28 w-full" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                      <Skeleton className="h-96 w-full" />
                  </div>
                   <div className="lg:col-span-1">
                       <Skeleton className="h-96 w-full" />
                  </div>
              </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col gap-6">
      <StatsCards appointments={enrichedAppointments} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <Card className="h-full">
              <CardHeader>
                <CardTitle>مواعيد اليوم</CardTitle>
                <CardDescription>
                  قائمة بالمواعيد المجدولة لليوم: {format(new Date(), 'PPP')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todaysAppointments.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المريض</TableHead>
                        <TableHead>الطبيب</TableHead>
                        <TableHead>الوقت</TableHead>
                        <TableHead>الحالة</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {todaysAppointments.map((appointment) => (
                        <TableRow key={appointment.id} className="cursor-pointer" onClick={() => router.push(`/patients/${appointment.patientId}`)}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src={appointment.patient.avatar} alt={appointment.patient.name} data-ai-hint="person face" />
                                <AvatarFallback>{appointment.patient.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="font-medium">{appointment.patient.name}</div>
                            </div>
                          </TableCell>
                          <TableCell>{appointment.doctor.name}</TableCell>
                          <TableCell>{appointment.startTime}</TableCell>
                          <TableCell>
                            <Badge variant={appointment.status === 'Completed' ? 'default' : 'secondary'}>
                              {appointment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-muted-foreground">لا توجد مواعيد لليوم.</p>
                  </div>
                )}
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
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
                        {users.map((user) => (
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
                                    <div className={cn("flex items-center gap-2", user.status === 'online' ? 'text-green-600' : 'text-muted-foreground')}>
                                       <span className={cn("h-2 w-2 rounded-full", user.status === 'online' ? 'bg-green-500' : 'bg-gray-400')} />
                                        {user.status === 'online' ? 'متصل' : 'غير متصل'}
                                    </div>
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
      </div>
    </div>
  )
}
