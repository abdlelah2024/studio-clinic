
"use client"
import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, DollarSign, Users, Calendar } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReportsPage() {
  const { enrichedAppointments, loading } = useAppContext();

  const completedAppointments = enrichedAppointments.filter(a => a.status === 'Completed');
  const totalRevenue = completedAppointments.reduce((sum, app) => sum + (app.cost || 0), 0);
  const uniquePatients = new Set(completedAppointments.map(a => a.patientId)).size;

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
          {loading ? (
             <div className="grid md:grid-cols-3 gap-4 text-center">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
          ) : completedAppointments.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <Card>
                  <CardHeader className="flex flex-row items-center justify-center space-x-2 space-y-0 pb-2">
                      <DollarSign className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">إجمالي الإيرادات</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">{totalRevenue.toLocaleString()} ر.ي</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-center space-x-2 space-y-0 pb-2">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">المواعيد المكتملة</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">{completedAppointments.length}</p>
                  </CardContent>
              </Card>
               <Card>
                  <CardHeader className="flex flex-row items-center justify-center space-x-2 space-y-0 pb-2">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <CardTitle className="text-lg font-medium">المرضى (فريد)</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-3xl font-bold">{uniquePatients}</p>
                  </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-10">
                <p>لا توجد بيانات كافية لعرض الإحصائيات حالياً.</p>
                <p className="text-sm text-muted-foreground">أكمل بعض المواعيد لتظهر هنا.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
