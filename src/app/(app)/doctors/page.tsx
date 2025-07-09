import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Stethoscope } from "lucide-react"

export default function DoctorsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الأطباء</CardTitle>
            <CardDescription>إدارة ملفات الأطباء وجداولهم.</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              إضافة طبيب
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
            <div className="flex flex-col items-center gap-1 text-center">
              <Stethoscope className="h-12 w-12 text-muted-foreground" />
              <h3 className="text-2xl font-bold tracking-tight">
                لم يتم العثور على أطباء
              </h3>
              <p className="text-sm text-muted-foreground">
                يمكنك البدء في إدارة الأطباء بمجرد إضافة واحد.
              </p>
              <Button className="mt-4">إضافة طبيب</Button>
            </div>
          </div>
      </CardContent>
    </Card>
  )
}
