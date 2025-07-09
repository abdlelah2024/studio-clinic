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
        title: "Error",
        description: "Medical term cannot be empty.",
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
          title: "Error",
          description: "Failed to get explanation. Please try again.",
          variant: "destructive",
        })
      }
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation)
    toast({
      title: "Copied!",
      description: "Explanation copied to clipboard.",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Explain Medical Term</CardTitle>
          <CardDescription>Enter a term to get a simple explanation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="term">Medical Term</Label>
            <Input
              id="term"
              placeholder="e.g., 'Otolaryngology'"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
          {isPending ? (
            <div className="flex items-center justify-center pt-4">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Getting explanation...</p>
              </div>
            </div>
          ) : explanation && (
            <div className="relative pt-4">
                <Label htmlFor="explanation">Explanation</Label>
                 <Textarea
                    id="explanation"
                    placeholder="Explanation will appear here..."
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
                Explaining...
              </>
            ) : (
              <>
                <BookOpen className="mr-2 h-4 w-4" />
                Explain Term
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
