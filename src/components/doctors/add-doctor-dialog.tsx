
"use client"
import React, { useState } from "react"
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

interface AddDoctorDialogProps {
  children: React.ReactNode;
  onDoctorAdded: (doctor: Omit<Doctor, 'id' | 'avatar'>) => void;
}

export function AddDoctorDialog({ children, onDoctorAdded }: AddDoctorDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [servicePrice, setServicePrice] = useState("");
  const [freeReturnPeriod, setFreeReturnPeriod] = useState("");

  const handleSubmit = () => {
    if (name && specialty) {
      onDoctorAdded({ 
        name, 
        specialty,
        servicePrice: servicePrice ? parseInt(servicePrice) : undefined,
        freeReturnPeriod: freeReturnPeriod ? parseInt(freeReturnPeriod) : undefined
      });
      setOpen(false);
      setName("");
      setSpecialty("");
      setServicePrice("");
      setFreeReturnPeriod("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة طبيب جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الطبيب الجديد.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" placeholder="د. أحمد علي" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialty" className="text-right">
              التخصص
            </Label>
            <Input id="specialty" placeholder="طب الأسنان" className="col-span-3" value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicePrice" className="text-right">
              سعر الخدمة
            </Label>
            <Input id="servicePrice" type="number" placeholder="200" className="col-span-3" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="freeReturnPeriod" className="text-right">
              عودة مجانية (أيام)
            </Label>
            <Input id="freeReturnPeriod" type="number" placeholder="14" className="col-span-3" value={freeReturnPeriod} onChange={(e) => setFreeReturnPeriod(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>حفظ الطبيب</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
