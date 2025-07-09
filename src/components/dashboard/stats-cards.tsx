import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, Activity } from "lucide-react"
import { mockAppointments, mockPatients } from "@/lib/data"

export function StatsCards() {
  const totalAppointments = mockAppointments.length;
  // Let's define "new" as anyone who was added in the last 30 days for this example.
  // In a real app, this would likely be based on a `createdAt` date.
  const newPatientsCount = mockPatients.length > 3 ? 2 : mockPatients.length; // Simplified logic for demo

  const stats = [
    { title: "إجمالي المواعيد", value: totalAppointments.toString(), icon: Calendar, change: "+12.5% من الشهر الماضي" },
    { title: "مرضى جدد", value: newPatientsCount.toString(), icon: Users, change: "+5.2% من الشهر الماضي" },
    { title: "الإيرادات", value: "$45,231.89", icon: DollarSign, change: "+20.1% من الشهر الماضي" },
    { title: "إشغال العيادة", value: "72%", icon: Activity, change: "-1.8% من الشهر الماضي" },
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
