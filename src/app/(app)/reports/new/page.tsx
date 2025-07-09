import { GenerateReportForm } from "@/components/reports/generate-report-form";

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
        </div>
    )
}
