
"use client"
import Link from "next/link"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockPatients } from "@/lib/data"
import type { Patient } from "@/lib/types"
import { MoreHorizontal, PlusCircle, Search } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { AddPatientDialog } from "@/components/patients/add-patient-dialog"
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog"
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog"
import { format } from "date-fns"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddPatient = (newPatient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => {
    const patientWithDefaults: Patient = {
      id: `p${patients.length + 1}`,
      ...newPatient,
      avatar: `https://placehold.co/100x100/E0E0E0/000000.png?text=${newPatient.name.charAt(0)}`,
      lastVisit: format(new Date(), 'yyyy-MM-dd')
    };
    setPatients(prev => [patientWithDefaults, ...prev]);
  };

  const handleUpdatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  }

  const handleDeletePatient = (patientId: string) => {
    setPatients(prev => prev.filter(p => p.id !== patientId));
  }

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableHead>البريد الإلكتروني</TableHead>
              <TableHead>الهاتف</TableHead>
              <TableHead>تاريخ الميلاد</TableHead>
              <TableHead>آخر زيارة</TableHead>
              <TableHead>
                <span className="sr-only">الإجراءات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                </TableCell>
                <TableCell>{patient.email}</TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.dob}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell>
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
                        <Link href={`/patients/${patient.id}`}>عرض التاريخ الطبي</Link>
                      </DropdownMenuItem>
                       <EditPatientDialog patient={patient} onPatientUpdated={handleUpdatePatient}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>تعديل الملف الشخصي</DropdownMenuItem>
                       </EditPatientDialog>
                      <DropdownMenuItem>حجز موعد</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DeletePatientDialog patient={patient} onDelete={() => handleDeletePatient(patient.id)}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف المريض</DropdownMenuItem>
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
