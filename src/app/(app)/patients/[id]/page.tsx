
"use client"
import { useMemo } from "react";
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient, AppointmentWithDetails } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function PatientDetailPage() {
  const { patients, enrichedAppointments, loading } = useAppContext();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const patient = useMemo(() => {
      if (loading || !id) return undefined;
      return patients.find(p => p.id === id);
  }, [id, patients, loading]);
  
  const patientHistory = useMemo(() => {
    if (!id) return [];
    return enrichedAppointments
      .filter(app => app.patientId === id)
      .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [id, enrichedAppointments]);


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
                <CardDescription>عرض جميع المعلومات المتعلقة بالمريض.</CardDescription>
            </CardHeader>
            <CardContent>
                {patientHistory.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>التاريخ</TableHead>
                                <TableHead>الطبيب</TableHead>
                                <TableHead>السبب</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead>التكلفة</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patientHistory.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell>{format(new Date(app.date), 'yyyy-MM-dd')}</TableCell>
                                    <TableCell>{app.doctor.name}</TableCell>
                                    <TableCell>{app.reason}</TableCell>
                                    <TableCell><Badge variant="outline">{app.status}</Badge></TableCell>
                                    <TableCell>{app.cost ? `${app.cost} ر.ي` : '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p>لا يوجد تاريخ طبي لعرضه حالياً.</p>
                )}
            </CardContent>
        </Card>
    </div>
  )
}
