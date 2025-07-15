
"use client"
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAppContext } from "@/context/app-context";
import { Skeleton } from "@/components/ui/skeleton";
import type { Patient } from "@/lib/types";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const { patients, loading } = useAppContext();
  const { id } = params;

  const patient = useMemo(() => {
      if (loading) return undefined;
      return patients.find(p => p.id === id);
  }, [id, patients, loading]);
  

  if (loading || !patient) {
    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
                 <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
             <Avatar className="h-24 w-24">
                <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold">{patient.name}</h1>
                <div className="text-muted-foreground space-x-4 rtl:space-x-reverse">
                    <span>{patient.phone}</span>
                    <span>|</span>
                    <span>العمر: {patient.age}</span>
                </div>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>التاريخ الطبي</CardTitle>
                <CardDescription>عرض جميع المعلومات المتعلقة بالمريض.</CardDescription>
            </CardHeader>
            <CardContent>
               <p>لا يوجد تاريخ طبي لعرضه حالياً.</p>
            </CardContent>
        </Card>
    </div>
  )
}
