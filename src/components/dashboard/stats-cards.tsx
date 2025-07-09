
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, Activity } from "lucide-react"
import { mockPatients } from "@/lib/data"
import type { Appointment } from "@/lib/types"

interface StatsCardsProps {
  appointments: Appointment[];
}

export function StatsCards({ appointments }: StatsCardsProps) {
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  // This is a simplified logic for demo. In a real app, you'd filter patients by creation date within the time range.
  const newPatientsCount = mockPatients.length > 3 ? 2 : mockPatients.length; 
  // Simplified revenue calculation
  const revenue = completedAppointments * 150; 


  const stats = [
    { title: "إجمالي المواعيد", value: totalAppointments.toString(), icon: Calendar, change: "ضمن النطاق المحدد" },
    { title: "مرضى جدد", value: newPatientsCount.toString(), icon: Users, change: "+5.2% من الشهر الماضي" },
    { title: "الإيرادات (تقديري)", value: `$${revenue.toLocaleString()}`, icon: DollarSign, change: "ضمن النطاق المحدد" },
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
