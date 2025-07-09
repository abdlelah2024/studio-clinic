
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function MessagingPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>المراسلات</CardTitle>
                <CardDescription>التواصل مع أعضاء الفريق الآخرين داخل العيادة.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-20">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-2xl font-bold tracking-tight">
                            لا توجد رسائل
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            لم يتم تنفيذ قسم المراسلات بعد.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
