
"use client"
import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Patient } from '@/lib/types'
import { Button } from '../ui/button'

interface DeletePatientDialogProps {
    children: React.ReactNode;
    patient: Patient;
    onDelete: () => void;
}

export function DeletePatientDialog({ children, patient, onDelete }: DeletePatientDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
          <AlertDialogDescription>
            سيؤدي هذا الإجراء إلى حذف سجل المريض <span className="font-bold">{patient.name}</span> بشكل دائم. لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
           <AlertDialogCancel asChild>
             <Button variant="outline">إلغاء</Button>
          </AlertDialogCancel>
          <AlertDialogAction onClick={onDelete} asChild>
            <Button variant="destructive">نعم، احذف المريض</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
