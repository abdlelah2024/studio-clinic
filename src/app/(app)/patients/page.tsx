
"use client"
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockPatients } from "@/lib/data"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { Patient } from "@/lib/types"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog"
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog"
import { useToast } from "@/hooks/use-toast"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAddPatient = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => {
    const newPatient: Patient = {
      ...patient,
      id: `p${patients.length + 1}`,
      avatar: `https://placehold.co/100x100?text=${patient.name.charAt(0)}`,
      lastVisit: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => [newPatient, ...prev]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };
  
  const handleDeletePatient = (patientId: string) => {
    const patientName = patients.find(p => p.id === patientId)?.name;
    setPatients(prev => prev.filter(p => p.id !== patientId));
    toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف المريض ${patientName}.`,
      variant: "destructive"
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery)
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>المرضى</CardTitle>
            <CardDescription>إدارة سجلات المرضى الخاصة بك.</CardDescription>
          </div>
           <div className="flex items-center gap-2 w-full max-w-sm">
             <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="البحث بالاسم أو الرقم..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <AddPatientDialog onPatientAdded={handleAddPatient}>
              <Button size="sm" className="gap-1 whitespace-nowrap">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">
                  إضافة مريض
                </span>
              </Button>
            </AddPatientDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>العمر</TableHead>
              <TableHead>آخر زيارة</TableHead>
              <TableHead><span className="sr-only">الإجراءات</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Link href={`/patients/${patient.id}`} className="flex items-center gap-3 hover:underline">
                    <Avatar>
                      <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{patient.name}</span>
                  </Link>
                </TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${patient.id}`}>
                            عرض السجل
                          </Link>
                        </DropdownMenuItem>
                        <EditPatientDialog patient={patient} onPatientUpdated={handleUpdatePatient}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                        </EditPatientDialog>
                        <DropdownMenuSeparator />
                        <DeletePatientDialog patient={patient} onDelete={() => handleDeletePatient(patient.id)}>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            حذف
                          </DropdownMenuItem>
                        </DeletePatientDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
