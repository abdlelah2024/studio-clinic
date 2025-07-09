
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
import type { Patient } from "@/lib/types"

interface AddPatientDialogProps {
  children: React.ReactNode;
  onPatientAdded: (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => void;
}

export function AddPatientDialog({ children, onPatientAdded }: AddPatientDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");

  const handleSubmit = () => {
    if (name && phone && email && dob) {
      onPatientAdded({ name, phone, email, dob });
      setOpen(false);
      setName("");
      setPhone("");
      setEmail("");
      setDob("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مريض جديد</DialogTitle>
          <DialogDescription>
            إنشاء سجل مريض جديد. يمكنك إضافة المزيد من التفاصيل لاحقًا.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" placeholder="أحمد محمود" className="col-span-3" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              الهاتف
            </Label>
            <Input id="phone" placeholder="555-123-4567" className="col-span-3" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              البريد الإلكتروني
            </Label>
            <Input id="email" type="email" placeholder="ahmad@example.com" className="col-span-3" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="dob" className="text-right">
              تاريخ الميلاد
            </Label>
            <Input id="dob" type="date" className="col-span-3" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>حفظ المريض</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
