
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AuditLogPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>مراقبة التعديلات</CardTitle>
                <CardDescription>عرض سجل بالتغييرات التي تم إجراؤها في النظام.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <History className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-2xl font-bold tracking-tight">
                            لا توجد تعديلات مسجلة
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            لم يتم تنفيذ قسم مراقبة التعديلات بعد.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
