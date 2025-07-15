
"use client"
import React, { useState, useEffect, useCallback } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import type { Appointment, Patient, Doctor, AppointmentStatus } from "@/lib/types"
import { Combobox } from "../ui/combobox"
import { Checkbox } from "../ui/checkbox"
import { useAppContext } from "@/context/app-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useToast } from "@/hooks/use-toast"

interface NewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPatientId?: string;
}

export function NewAppointmentDialog({ open, onOpenChange, initialPatientId }: NewAppointmentDialogProps) {
  const { patients, doctors, addAppointment } = useAppContext();
  const { toast } = useToast();
  
  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState<AppointmentStatus>('Scheduled');
  const [freeReturn, setFreeReturn] = useState(false);
  
  const selectedDoctor = doctors.find(d => d.id === doctorId);

  const resetForm = useCallback(() => {
    setPatientId(initialPatientId || "");
    setDoctorId("");
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setStatus('Scheduled');
    setFreeReturn(false);
  },[initialPatientId]);

  useEffect(() => {
    if (open) {
       resetForm();
    }
  }, [open, resetForm]);
  
  const handleSubmit = () => {
    if (!patientId || !doctorId || !date || !startTime || !endTime || !reason) {
       toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء جميع الحقول المطلوبة.",
        variant: "destructive",
      });
      return;
    }
    addAppointment({ patientId, doctorId, date, startTime, endTime, reason, freeReturn, status });
    onOpenChange(false);
  };
  
  const patientOptions = patients.map(p => ({ value: p.id, label: p.name }));
  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.name }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                selectedValue={patientId}
                onSelectedValueChange={setPatientId}
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
                selectedValue={doctorId}
                onSelectedValueChange={setDoctorId}
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
                الحالة
            </Label>
            <Select value={status} onValueChange={(v) => setStatus(v as AppointmentStatus)}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر حالة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Scheduled">مجدول</SelectItem>
                    <SelectItem value="Waiting">منتظر</SelectItem>
                    <SelectItem value="Completed">مكتمل</SelectItem>
                    <SelectItem value="Canceled">ملغى</SelectItem>
                </SelectContent>
            </Select>
          </div>
           {selectedDoctor?.freeReturnPeriod && (
            <div className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1" />
                <div className="col-span-3 flex items-center space-x-2 space-x-reverse">
                    <Checkbox id="free-return" checked={freeReturn} onCheckedChange={(checked) => setFreeReturn(!!checked)} />
                    <Label htmlFor="free-return" className="text-sm font-normal text-muted-foreground">
                        تضمين عودة مجانية (خلال {selectedDoctor.freeReturnPeriod} يوم)
                    </Label>
                </div>
            </div>
           )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>جدولة الموعد</Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

    