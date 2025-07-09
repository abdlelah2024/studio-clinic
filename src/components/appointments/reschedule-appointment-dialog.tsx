
"use client"
import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Appointment, Doctor, Patient } from "@/lib/types"

type EnrichedAppointment = Appointment & {
  patient: Patient;
  doctor: Doctor;
};

interface RescheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: EnrichedAppointment;
  onAppointmentRescheduled: (appointmentId: string, newDate: string, newStartTime: string, newEndTime: string) => void;
}

export function RescheduleAppointmentDialog({ open, onOpenChange, appointment, onAppointmentRescheduled }: RescheduleAppointmentDialogProps) {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (appointment) {
      setDate(appointment.date);
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
    }
  }, [appointment]);

  const handleSubmit = () => {
    if (appointment && date && startTime && endTime) {
      onAppointmentRescheduled(appointment.id, date, startTime, endTime);
      onOpenChange(false);
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>إعادة جدولة الموعد</DialogTitle>
          <DialogDescription>
            إعادة جدولة الموعد لـ <span className="font-bold">{appointment.patient.name}</span>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>حفظ التغييرات</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
