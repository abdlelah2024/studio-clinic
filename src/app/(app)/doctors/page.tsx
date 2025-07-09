
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { mockDoctors } from "@/lib/data"
import type { Doctor } from "@/lib/types"
import { MoreHorizontal, PlusCircle, Edit, Trash2, Calendar } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AddDoctorDialog } from "@/components/doctors/add-doctor-dialog"
import { EditDoctorDialog } from "@/components/doctors/edit-doctor-dialog"
import { DeleteDoctorDialog } from "@/components/doctors/delete-doctor-dialog"
import { useToast } from "@/hooks/use-toast"

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const { toast } = useToast();

  const handleAddDoctor = (doctor: Omit<Doctor, 'id' | 'avatar'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: `d${doctors.length + 1}`,
      avatar: `https://placehold.co/100x100?text=${doctor.name.charAt(0)}`,
    };
    setDoctors(prev => [newDoctor, ...prev]);
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة الطبيب ${doctor.name}.`,
    });
  };

  const handleUpdateDoctor = (updatedDoctor: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoctor.id ? updatedDoctor : d));
    toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث بيانات الطبيب ${updatedDoctor.name}.`,
    });
  };

  const handleDeleteDoctor = (doctorId: string) => {
    const doctorName = doctors.find(d => d.id === doctorId)?.name;
    setDoctors(prev => prev.filter(d => d.id !== doctorId));
    toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف الطبيب ${doctorName}.`,
      variant: "destructive",
    });
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الأطباء</CardTitle>
            <CardDescription>إدارة ملفات الأطباء وجداولهم.</CardDescription>
          </div>
          <AddDoctorDialog onDoctorAdded={handleAddDoctor}>
            <Button size="sm" className="gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                إضافة طبيب
              </span>
            </Button>
          </AddDoctorDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={doctor.avatar} alt={doctor.name} data-ai-hint="doctor person" />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{doctor.name}</div>
                  </div>
                </TableCell>
                <TableCell>{doctor.specialty}</TableCell>
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
                      <DropdownMenuItem>
                        <Calendar className="mr-2 h-4 w-4" />
                        عرض الجدول
                      </DropdownMenuItem>
                      <EditDoctorDialog doctor={doctor} onDoctorUpdated={handleUpdateDoctor}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            تعديل الملف الشخصي
                        </DropdownMenuItem>
                      </EditDoctorDialog>
                      <DropdownMenuSeparator />
                      <DeleteDoctorDialog doctor={doctor} onDelete={() => handleDeleteDoctor(doctor.id)}>
                        <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            إزالة
                        </DropdownMenuItem>
                      </DeleteDoctorDialog>
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
