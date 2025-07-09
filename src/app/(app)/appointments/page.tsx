import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockAppointments } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, PlusCircle, ListFilter, UserPlus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { QuickAddPatientDialog } from "@/components/appointments/quick-add-patient"
import { differenceInDays, parseISO } from "date-fns"

export default function AppointmentsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Manage and view all patient appointments.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Scheduled</DropdownMenuItem>
                <DropdownMenuItem>Completed</DropdownMenuItem>
                <DropdownMenuItem>Canceled</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <QuickAddPatientDialog />
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                New Appointment
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Free Return (7 days)</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAppointments.map((appointment) => {
              const appointmentDate = parseISO(appointment.date);
              const daysSinceAppointment = differenceInDays(new Date(), appointmentDate);
              const isFreeReturn = appointment.status === 'Completed' && daysSinceAppointment >= 0 && daysSinceAppointment <= 7;

              return (
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
                  <TableCell>
                     <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={appointment.doctor.avatar} data-ai-hint="doctor person" />
                        <AvatarFallback>{appointment.doctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{appointment.doctor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{appointment.reason}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.startTime}</TableCell>
                  <TableCell>
                    <Badge variant={appointment.status === 'Completed' ? 'default' : appointment.status === 'Canceled' ? 'destructive' : 'secondary'}>
                      {appointment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {isFreeReturn ? (
                        <Badge variant="secondary">Eligible</Badge>
                    ) : (
                        <Badge variant="outline">Not Eligible</Badge>
                    )}
                   </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuItem>Cancel</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
