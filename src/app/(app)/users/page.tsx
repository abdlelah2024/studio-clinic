import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users } from "lucide-react"

export default function UsersPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>المستخدمون</CardTitle>
            <CardDescription>إدارة حسابات المستخدمين والأذونات.</CardDescription>
          </div>
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              إضافة مستخدم
            </span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
          <div className="flex flex-col items-center gap-1 text-center">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-2xl font-bold tracking-tight">
              لم يتم العثور على مستخدمين
            </h3>
            <p className="text-sm text-muted-foreground">
              يمكنك البدء في إدارة المستخدمين بمجرد إضافة واحد.
            </p>
            <Button className="mt-4">إضافة مستخدم</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
