
"use client"
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Doctor } from "@/lib/types"

interface EditDoctorDialogProps {
  children: React.ReactNode;
  doctor: Doctor;
  onDoctorUpdated: (doctor: Doctor) => void;
}

export function EditDoctorDialog({ children, doctor, onDoctorUpdated }: EditDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Doctor>>(doctor);

  useEffect(() => {
    if (open) {
      setFormData(doctor);
    }
  }, [open, doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}))
  }
  
  const handleSubmit = () => {
     const updatedDoctor: Doctor = {
      ...doctor,
      ...formData,
      servicePrice: formData.servicePrice ? parseInt(String(formData.servicePrice)) : undefined,
      freeReturnPeriod: formData.freeReturnPeriod ? parseInt(String(formData.freeReturnPeriod)) : undefined
    };
    onDoctorUpdated(updatedDoctor);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات الطبيب</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل الطبيب.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialty" className="text-right">
              التخصص
            </Label>
            <Input id="specialty" value={formData.specialty} onChange={handleChange} className="col-span-3" />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicePrice" className="text-right">
              سعر الخدمة
            </Label>
            <Input id="servicePrice" type="number" value={formData.servicePrice ?? ""} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="freeReturnPeriod" className="text-right">
              عودة مجانية (أيام)
            </Label>
            <Input id="freeReturnPeriod" type="number" value={formData.freeReturnPeriod ?? ""} onChange={handleChange} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>حفظ التغييرات</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
