import { GenerateReportForm } from "@/components/reports/generate-report-form";
import { ExplainTermForm } from "@/components/reports/explain-term-form";
import { Separator } from "@/components/ui/separator";

export default function NewReportPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold font-headline">AI Report Draft Tool</h1>
                <p className="text-muted-foreground">
                    Analyze appointment notes and create draft reports with ICD codes to support quick billing.
                </p>
            </div>
            <GenerateReportForm />
            <Separator />
             <div>
                <h2 className="text-xl font-bold font-headline">Medical Term Explainer</h2>
                <p className="text-muted-foreground">
                    Get quick, simple explanations for complex medical terms.
                </p>
            </div>
            <ExplainTermForm />
        </div>
    )
}
