
"use client"
import React, { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function ReportsPage() {

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>التقارير والإحصائيات</CardTitle>
              <CardDescription>تحليل بيانات العيادة.</CardDescription>
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
            <div className="text-center py-10">
                <p>لا توجد بيانات كافية لعرض الإحصائيات حالياً.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
