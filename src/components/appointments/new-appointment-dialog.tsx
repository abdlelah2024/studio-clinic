
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
import { Textarea } from "@/components/ui/textarea"
import type { Appointment } from "@/lib/types"
import { mockPatients, mockDoctors } from "@/lib/data"
import { Combobox } from "../ui/combobox"


interface NewAppointmentDialogProps {
  children: React.ReactNode;
  onAppointmentAdded: (appointment: Omit<Appointment, 'id' | 'patient' | 'doctor' | 'status'> & { patientName: string, doctorName: string }) => void;
}

export function NewAppointmentDialog({ children, onAppointmentAdded }: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (patientName && doctorName && date && startTime && endTime && reason) {
      onAppointmentAdded({ patientName, doctorName, date, startTime, endTime, reason });
      setOpen(false);
      // Reset form
      setPatientName("");
      setDoctorName("");
      setDate("");
      setStartTime("");
      setEndTime("");
      setReason("");
    }
  };
  
  const patientOptions = mockPatients.map(p => ({ value: p.name, label: p.name }));
  const doctorOptions = mockDoctors.map(d => ({ value: d.name, label: d.name }));


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>حجز موعد جديد</DialogTitle>
          <DialogDescription>
            املأ التفاصيل أدناه لجدولة موعد جديد.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="patient" className="text-right">
              المريض
            </Label>
             <Combobox
                options={patientOptions}
                selectedValue={patientName}
                onSelectedValueChange={setPatientName}
                placeholder="اختر مريض..."
                searchPlaceholder="ابحث عن مريض..."
                noResultsText="لم يتم العثور على مريض."
                className="col-span-3"
             />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctor" className="text-right">
              الطبيب
            </Label>
            <Combobox
                options={doctorOptions}
                selectedValue={doctorName}
                onSelectedValueChange={setDoctorName}
                placeholder="اختر طبيب..."
                searchPlaceholder="ابحث عن طبيب..."
                noResultsText="لم يتم العثور على طبيب."
                className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              التاريخ
            </Label>
            <Input id="date" type="date" className="col-span-3" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              الوقت
            </Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
                <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>
           <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="reason" className="text-right pt-2">
              السبب
            </Label>
            <Textarea id="reason" placeholder="سبب الزيارة..." className="col-span-3" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>جدولة الموعد</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
