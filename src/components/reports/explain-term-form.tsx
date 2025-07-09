"use client"
import React, { useState, useTransition } from "react"
import { explainMedicalTerm } from "@/ai/flows/explain-term-flow"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Bot, Clipboard, Loader2, BookOpen } from "lucide-react"
import { Input } from "../ui/input"

export function ExplainTermForm() {
  const [isPending, startTransition] = useTransition()
  const [term, setTerm] = useState("")
  const [explanation, setExplanation] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!term) {
      toast({
        title: "خطأ",
        description: "لا يمكن أن يكون المصطلح الطبي فارغًا.",
        variant: "destructive",
      })
      return
    }
    setExplanation("")
    startTransition(async () => {
      try {
        const result = await explainMedicalTerm({ term: term })
        if (result.explanation) {
          setExplanation(result.explanation)
        } else {
            throw new Error("No explanation returned.")
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "خطأ",
          description: "فشل في الحصول على الشرح. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        })
      }
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    toast({
      title: "تم النسخ!",
      description: "تم نسخ الشرح إلى الحافظة.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>شرح مصطلح طبي</CardTitle>
          <CardDescription>أدخل مصطلحًا للحصول على شرح بسيط.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="term">المصطلح الطبي</Label>
            <Input
              id="term"
              placeholder="على سبيل المثال، 'طب الأنف والأذن والحنجرة'"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          {isPending ? (
            <div className="flex items-center justify-center pt-4">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>جارٍ الحصول على الشرح...</p>
              </div>
            </div>
          ) : explanation && (
            <div className="relative pt-4">
                <Label htmlFor="explanation">الشرح</Label>
                 <Textarea
                    id="explanation"
                    placeholder="سيظهر الشرح هنا..."
                    value={explanation}
                    readOnly
                    rows={4}
                    className="bg-muted mt-1.5"
                 />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-6 right-2"
                    onClick={handleCopy}
                    type="button"
                >
                    <Clipboard className="h-4 w-4" />
                </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                جارٍ الشرح...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                اشرح المصطلح
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
