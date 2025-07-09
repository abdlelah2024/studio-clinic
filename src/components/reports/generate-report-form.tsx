"use client"
import React, { useState, useTransition } from "react"
import { generateReportDraft } from "@/ai/flows/generate-report-draft"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bot, Clipboard, Loader2 } from "lucide-react"

export function GenerateReportForm() {
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes] = useState("")
  const [draft, setDraft] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!notes) {
      toast({
        title: "خطأ",
        description: "لا يمكن أن تكون ملاحظات الموعد فارغة.",
        variant: "destructive",
      })
      return
    }
    setDraft("")
    startTransition(async () => {
      const result = await generateReportDraft({ appointmentNotes: notes })
      if (result.reportDraft) {
        setDraft(result.reportDraft)
        toast({
          title: "نجاح",
          description: "تم إنشاء مسودة التقرير بنجاح.",
        })
      } else {
        toast({
          title: "خطأ",
          description: "فشل في إنشاء مسودة التقرير. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        })
      }
    })
  }
  
  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    toast({
      title: "تم النسخ!",
      description: "تم نسخ مسودة التقرير إلى الحافظة.",
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>ملاحظات الموعد</CardTitle>
            <CardDescription>أدخل الملاحظات من موعد المريض.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full gap-1.5">
              <Label htmlFor="notes">الملاحظات</Label>
              <Textarea
                placeholder="اكتب أو الصق ملاحظات الموعد هنا..."
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={15}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  جارٍ الإنشاء...
                </>
              ) : (
                 <>
                  <Bot className="mr-2 h-4 w-4" />
                  إنشاء مسودة
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>مسودة التقرير المنشأة بالذكاء الاصطناعي</CardTitle>
            <CardDescription>راجع المسودة التي أنشأها الذكاء الاصطناعي، بما في ذلك رموز ICD.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            {isPending ? (
               <div className="flex items-center justify-center h-full">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>جارٍ إنشاء التقرير...</p>
                  </div>
                </div>
            ) : (
            <div className="relative">
              <Textarea
                placeholder="سيظهر التقرير المنشأ هنا..."
                value={draft}
                readOnly
                rows={15}
                className="bg-muted"
              />
              {draft && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                  type="button"
                >
                  <Clipboard className="h-4 w-4" />
                </Button>
              )}
            </div>
            )}
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
