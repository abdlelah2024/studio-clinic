
"use client"
import React, { useState, useMemo, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wifi, Users, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppContext } from "@/context/app-context"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentCalendar } from "@/components/dashboard/appointment-calendar"

export default function DashboardPage() {
  const { users, enrichedAppointments, loading } = useAppContext();
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    if (typeof window !== 'undefined') {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        setIsOnline(navigator.onLine);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }, []);
  
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
           <AppointmentCalendar />
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
