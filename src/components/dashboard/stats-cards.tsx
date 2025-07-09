import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, Activity } from "lucide-react"

const stats = [
  { title: "Total Appointments", value: "1,234", icon: Calendar, change: "+12.5%" },
  { title: "New Patients", value: "89", icon: Users, change: "+5.2%" },
  { title: "Revenue", value: "$45,231.89", icon: DollarSign, change: "+20.1%" },
  { title: "Clinic Occupancy", value: "72%", icon: Activity, change: "-1.8%" },
]

export function StatsCards() {
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
            <p className="text-xs text-muted-foreground">{stat.change} from last month</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
