import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, FileText } from "lucide-react"

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>التقارير والإحصائيات</CardTitle>
            <CardDescription>عرض وإدارة تقارير المرضى وتحليلات العيادة.</CardDescription>
          </div>
          <Button size="sm" className="gap-1" asChild>
            <Link href="/reports/new">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                مسودة جديدة بالذكاء الاصطناعي
              </span>
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
          <div className="flex flex-col items-center gap-1 text-center">
            <FileText className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-2xl font-bold tracking-tight">
              لم يتم العثور على تقارير
            </h3>
            <p className="text-sm text-muted-foreground">
              يمكنك البدء في إنشاء التقارير باستخدام أداة المسودة بالذكاء الاصطناعي.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/reports/new">مسودة جديدة بالذكاء الاصطناعي</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
