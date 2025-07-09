
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, Activity } from "lucide-react"
import type { Appointment, Doctor, Patient } from "@/lib/types"

type EnrichedAppointment = Appointment & {
  patient: Patient;
  doctor: Doctor;
};

interface StatsCardsProps {
  appointments: EnrichedAppointment[];
}

export function StatsCards({ appointments }: StatsCardsProps) {
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;

  const uniquePatientIds = new Set(appointments.map(a => a.patientId));
  const newPatientsCount = uniquePatientIds.size;
  
  // Simplified revenue calculation
  const revenue = appointments.filter(a => a.status === 'Completed').reduce((acc, curr) => acc + (curr.doctor.servicePrice || 0), 0); 


  const stats = [
    { title: "إجمالي المواعيد", value: totalAppointments.toString(), icon: Calendar, change: "ضمن النطاق المحدد" },
    { title: "المرضى (فريد)", value: newPatientsCount.toString(), icon: Users, change: "ضمن النطاق المحدد" },
    { title: "الإيرادات (تقديري)", value: `${revenue.toLocaleString()} ر.ي`, icon: DollarSign, change: "ضمن النطاق المحدد" },
    { title: "مواعيد مكتملة", value: completedAppointments.toString(), icon: Activity, change: "ضمن النطاق المحدد" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
