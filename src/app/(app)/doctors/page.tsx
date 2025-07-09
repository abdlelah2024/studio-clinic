import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Stethoscope } from "lucide-react"

export default function DoctorsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Manage doctor profiles and schedules.</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Doctor
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
            <div className="flex flex-col items-center gap-1 text-center">
              <Stethoscope className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-2xl font-bold tracking-tight">
                No doctors found
              </h3>
              <p className="text-sm text-muted-foreground">
                You can start managing doctors as soon as you add one.
              </p>
              <Button className="mt-4">Add Doctor</Button>
            </div>
          </div>
      </CardContent>
    </Card>
  )
}
