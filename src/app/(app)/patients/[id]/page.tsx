import { mockPatients, mockAppointments } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const patient = mockPatients.find(p => p.id === params.id);
  const patientAppointments = mockAppointments.filter(a => a.patient.name === patient?.name);

  if (!patient) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>لم يتم العثور على المريض.</p>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center space-x-4">
             <Avatar className="h-24 w-24">
                <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <div className="text-muted-foreground space-x-4 rtl:space-x-reverse">
                    <span>{patient.email}</span>
                    <span>|</span>
                    <span>{patient.phone}</span>
                    <span>|</span>
                    <span>تاريخ الميلاد: {patient.dob}</span>
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
                                    <TableCell>{appointment.doctor.name}</TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                    <TableCell>
                                        <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}>
                                        {appointment.status === 'Completed' ? 'مكتمل' : appointment.status === 'Canceled' ? 'ملغى' : 'مجدول'}
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
