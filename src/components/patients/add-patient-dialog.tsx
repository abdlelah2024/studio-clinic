
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
import type { Patient } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const patientSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  age: z.coerce.number().min(0, "العمر يجب أن يكون رقمًا موجبًا"),
});

type PatientFormData = z.infer<typeof patientSchema>;
type AddPatientFunction = (patient: Omit<Patient, 'id' | 'avatar' | 'lastVisit'>) => void;

interface AddPatientDialogProps {
  onPatientAdded?: AddPatientFunction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPatientDialog({ onPatientAdded, open, onOpenChange }: AddPatientDialogProps) {
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      phone: "",
      age: 0,
    },
  });
  
  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (data: PatientFormData) => {
    if (onPatientAdded) {
        onPatientAdded(data);
        toast({
            title: "تمت الإضافة بنجاح",
            description: `تمت إضافة المريض ${data.name} إلى السجلات.`,
        });
        onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة مريض جديد</DialogTitle>
          <DialogDescription>
            إنشاء سجل مريض جديد. يمكنك إضافة المزيد من التفاصيل لاحقًا.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">الاسم</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="أحمد محمود" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">الهاتف</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="555-123-4567" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">العمر</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit">حفظ المريض</Button>
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>إلغاء</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
