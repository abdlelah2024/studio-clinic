
"use client"
import React, { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
import { mockDoctors } from "@/lib/data"
import type { Doctor } from "@/lib/types"
import { MoreHorizontal, PlusCircle, Edit, Trash2, Calendar, Search, ArrowUpDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AddDoctorDialog } from "@/components/doctors/add-doctor-dialog"
import { EditDoctorDialog } from "@/components/doctors/edit-doctor-dialog"
import { DeleteDoctorDialog } from "@/components/doctors/delete-doctor-dialog"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"

type SortKey = 'name-asc' | 'name-desc' | 'specialty-asc' | 'specialty-desc';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(mockDoctors);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>('name-asc');
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

  const filteredAndSortedDoctors = useMemo(() => {
    const filtered = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.sort((a, b) => {
        switch (sortKey) {
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            case 'specialty-asc':
                return a.specialty.localeCompare(b.specialty);
            case 'specialty-desc':
                return b.specialty.localeCompare(a.specialty);
            default:
                return 0;
        }
    });
  }, [doctors, searchQuery, sortKey]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>الأطباء</CardTitle>
            <CardDescription>إدارة ملفات الأطباء وجداولهم.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="البحث بالاسم أو التخصص..."
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
                    <DropdownMenuCheckboxItem
                        checked={sortKey === 'specialty-asc'}
                        onSelect={() => setSortKey('specialty-asc')}
                    >
                        التخصص (أ-ي)
                    </DropdownMenuCheckboxItem>
                     <DropdownMenuCheckboxItem
                        checked={sortKey === 'specialty-desc'}
                        onSelect={() => setSortKey('specialty-desc')}
                    >
                        التخصص (ي-أ)
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <AddDoctorDialog onDoctorAdded={handleAddDoctor}>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  إضافة طبيب
                </span>
              </Button>
            </AddDoctorDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الاسم</TableHead>
              <TableHead>التخصص</TableHead>
              <TableHead>سعر الخدمة</TableHead>
              <TableHead>مدة العودة المجانية</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedDoctors.map((doctor) => (
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
                <TableCell>{doctor.servicePrice ? `${doctor.servicePrice} ر.ي` : 'N/A'}</TableCell>
                <TableCell>{doctor.freeReturnPeriod ? `${doctor.freeReturnPeriod} يوم` : 'لا يوجد'}</TableCell>
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
