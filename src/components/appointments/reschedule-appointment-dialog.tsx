
"use client"
import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Appointment } from "@/lib/types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format, parseISO } from "date-fns"
import { cn } from "@/lib/utils"

interface RescheduleAppointmentDialogProps {
  children: React.ReactNode;
  appointment: Appointment;
  onAppointmentUpdated: (appointment: Appointment) => void;
}

export function RescheduleAppointmentDialog({ children, appointment, onAppointmentUpdated }: RescheduleAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date(appointment.date));
  const [startTime, setStartTime] = useState(appointment.startTime);
  const [endTime, setEndTime] = useState(appointment.endTime);

  useEffect(() => {
    if (open) {
      setDate(new Date(appointment.date));
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
    }
  }, [open, appointment]);
  
  const handleSubmit = () => {
    if (date && startTime && endTime) {
      onAppointmentUpdated({
        ...appointment,
        date: format(date, 'yyyy-MM-dd'),
        startTime,
        endTime,
      });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>إعادة جدولة الموعد</DialogTitle>
          <DialogDescription>
            اختر تاريخًا ووقتًا جديدين للموعد.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>التاريخ الجديد</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>اختر تاريخاً</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                    </PopoverContent>
                </Popover>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startTime">وقت البدء الجديد</Label>
                    <Input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTime">وقت الانتهاء الجديد</Label>
                    <Input id="endTime" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
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
