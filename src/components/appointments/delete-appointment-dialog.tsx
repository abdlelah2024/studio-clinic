
"use client"
import React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import type { Appointment } from '@/lib/types'
import { Button } from '../ui/button'

interface DeleteAppointmentDialogProps {
    children: React.ReactNode;
    appointment: Appointment;
    onDelete: () => void;
}

export function DeleteAppointmentDialog({ children, appointment, onDelete }: DeleteAppointmentDialogProps) {
  const [open, setOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>هل أنت متأكد؟</DialogTitle>
          <DialogDescription>
            سيتم حذف موعد المريض <span className="font-bold">{appointment.patient.name}</span> بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          <Button variant="destructive" onClick={handleDelete}>نعم، احذف الموعد</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
