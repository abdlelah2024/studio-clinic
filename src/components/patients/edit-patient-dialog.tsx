
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
import type { Patient } from "@/lib/types"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"

const patientSchema = z.object({
  name: z.string().min(1, "الاسم مطلوب"),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
  dob: z.string().min(1, "تاريخ الميلاد مطلوب"),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface EditPatientDialogProps {
  children: React.ReactNode;
  patient: Patient;
  onPatientUpdated: (patient: Patient) => void;
}

export function EditPatientDialog({ children, patient, onPatientUpdated }: EditPatientDialogProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient,
  });

  useEffect(() => {
    if (open) {
      form.reset(patient);
    }
  }, [open, patient, form]);

  const onSubmit = (data: PatientFormData) => {
    onPatientUpdated({ ...patient, ...data });
     toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث بيانات المريض ${data.name}.`,
    });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل بيانات المريض</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل المريض.
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
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="col-span-3" />
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
                    <Input {...field} className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">تاريخ الميلاد</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" className="col-span-3" />
                  </FormControl>
                  <FormMessage className="col-span-4 text-center" />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">حفظ التغييرات</Button>
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>إلغاء</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
