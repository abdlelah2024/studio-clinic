
"use client"
import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAppContext } from "@/context/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient, AppointmentStatus } from "@/lib/types";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { enrichedAppointments, patients, loading } = useAppContext();
  const { id } = params;

  const patient = useMemo(() => {
      if (loading) return undefined;
      return patients.find(p => p.id === id);
  }, [id, patients, loading]);
  
  const patientAppointments = useMemo(() => {
    if (!patient) return [];
    return enrichedAppointments
      .filter(a => a.patientId === patient.id)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patient, enrichedAppointments]);


  if (loading || !patient) {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                 <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }
  
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
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <Avatar className="h-24 w-24">
                <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <div className="text-muted-foreground space-x-4 rtl:space-x-reverse">
                    <span>{patient.phone}</span>
                    <span>|</span>
                    <span>العمر: {patient.age}</span>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>التاريخ الطبي</CardTitle>
                <CardDescription>عرض جميع المواعيد السابقة والحالية للمريض.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>التاريخ</TableHead>
                            <TableHead>الطبيب</TableHead>
                            <TableHead>السبب</TableHead>
                            <TableHead>الحالة</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patientAppointments.length > 0 ? (
                            patientAppointments.map(appointment => (
                                <TableRow key={appointment.id}>
                                    <TableCell>{appointment.date}</TableCell>
                                    <TableCell>{appointment.doctor?.name || 'غير محدد'}</TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}>
                                        {getStatusTranslation(appointment.status)}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">لا توجد مواعيد متاحة.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  )
}
