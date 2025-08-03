
"use client"
import Link from "next/link"
import React, { useState, useMemo } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { PlusCircle, Search, MoreHorizontal, Edit, Trash2, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import type { Patient } from "@/lib/types"
import { EditPatientDialog } from "@/components/patients/edit-patient-dialog"
import { DeletePatientDialog } from "@/components/patients/delete-patient-dialog"
import { useAppContext } from "@/context/app-context"

type SortKey = 'name-asc' | 'name-desc' | 'visit-asc' | 'visit-desc';

export default function PatientsPage() {
  const { patients, openNewPatientDialog, updatePatient, deletePatient } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('visit-desc');
  const router = useRouter();
  
  const filteredAndSortedPatients = useMemo(() => {
    const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.phone.includes(searchQuery)
    );

    return filtered.sort((a, b) => {
        switch (sortKey) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'visit-asc':
                return new Date(a.lastVisit).getTime() - new Date(b.lastVisit).getTime();
            case 'visit-desc':
            default:
                return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        }
    });
  }, [patients, searchQuery, sortKey]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>المرضى</CardTitle>
            <CardDescription>إدارة سجلات المرضى الخاصة بك.</CardDescription>
          </div>
           <div className="flex items-center gap-2 w-full max-w-lg">
             <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="البحث بالاسم أو الرقم..."
                className="w-full rounded-lg bg-background pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        تصنيف
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>تصنيف حسب</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'visit-desc'}
                        onSelect={() => setSortKey('visit-desc')}
                    >
                        آخر زيارة (الأحدث)
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem
                        checked={sortKey === 'visit-asc'}
                        onSelect={() => setSortKey('visit-asc')}
                    >
                        آخر زيارة (الأقدم)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'name-asc'}
                        onSelect={() => setSortKey('name-asc')}
                    >
                        الاسم (أ-ي)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'name-desc'}
                        onSelect={() => setSortKey('name-desc')}
                    >
                        الاسم (ي-أ)
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" className="gap-1 whitespace-nowrap" onClick={() => openNewPatientDialog()}>
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">
                إضافة مريض
              </span>
            </Button>
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
            {filteredAndSortedPatients.map((patient) => (
              <TableRow key={patient.id} onClick={() => router.push(`/patients/${patient.id}`)} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={patient.avatar} alt={patient.name} data-ai-hint="person face" />
                      <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{patient.name}</span>
                  </div>
                </TableCell>
                <TableCell>{patient.phone}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.lastVisit}</TableCell>
                <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" onClick={(e) => e.stopPropagation()}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/patients/${patient.id}`}>
                            عرض السجل
                          </Link>
                        </DropdownMenuItem>
                        <EditPatientDialog patient={patient} onPatientUpdated={updatePatient}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل
                          </DropdownMenuItem>
                        </EditPatientDialog>
                        <DropdownMenuSeparator />
                        <DeletePatientDialog patient={patient} onDelete={() => deletePatient(patient.id)}>
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
