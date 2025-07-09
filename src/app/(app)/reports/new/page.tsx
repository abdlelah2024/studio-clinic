import { GenerateReportForm } from "@/components/reports/generate-report-form";
import { ExplainTermForm } from "@/components/reports/explain-term-form";
import { Separator } from "@/components/ui/separator";

export default function NewReportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">أداة مسودة التقرير بالذكاء الاصطناعي</h1>
                <p className="text-muted-foreground">
                    تحليل ملاحظات المواعيد وإنشاء مسودات تقارير مع رموز ICD لدعم الفوترة السريعة.
                </p>
            </div>
            <GenerateReportForm />
            <Separator />
             <div>
                <h2 className="text-xl font-bold font-headline">شرح المصطلحات الطبية</h2>
                <p className="text-muted-foreground">
                    الحصول على شروحات سريعة وبسيطة للمصطلحات الطبية المعقدة.
                </p>
            </div>
            <ExplainTermForm />
        </div>
    )
}
