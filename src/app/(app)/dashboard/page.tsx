import { StatsCards } from "@/components/dashboard/stats-cards"
import { AppointmentCalendar } from "@/components/dashboard/appointment-calendar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockAppointments } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardPage() {
  const upcomingAppointments = mockAppointments.filter(a => a.status === 'Scheduled' || a.status === 'Waiting').slice(0, 5);

  const getStatusTranslation = (status: 'Scheduled' | 'Completed' | 'Canceled' | 'Waiting') => {
    switch (status) {
      case 'Completed': return 'مكتمل';
      case 'Canceled': return 'ملغى';
      case 'Scheduled': return 'مجدول';
      case 'Waiting': return 'منتظر';
      default: return status;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <StatsCards />
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
                  {upcomingAppointments.map((appointment) => (
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
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
