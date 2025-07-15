
"use client"
import React, { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Appointment, Doctor, Patient } from "@/lib/types"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Combobox } from "../ui/combobox"

const appointmentSchema = z.object({
  patientId: z.string().min(1, "يجب اختيار المريض"),
  doctorId: z.string().min(1, "يجب اختيار الطبيب"),
  date: z.date({ required_error: "يجب اختيار تاريخ الموعد" }),
  startTime: z.string().min(1, "يجب تحديد وقت البدء"),
  endTime: z.string().min(1, "يجب تحديد وقت الانتهاء"),
  reason: z.string().min(1, "يجب كتابة سبب الزيارة"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface NewAppointmentDialogProps {
  children: React.ReactNode;
  patients: Patient[];
  doctors: Doctor[];
  onAppointmentAdded: (data: Omit<Appointment, 'id' | 'status'>) => void;
  openNewPatientDialog: (options: { initialName?: string }) => void;
  initialPatientId?: string;
}

export function NewAppointmentDialog({ children, patients, doctors, onAppointmentAdded, openNewPatientDialog, initialPatientId }: NewAppointmentDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });
  
  const [patientSearch, setPatientSearch] = useState('');
  
  useEffect(() => {
    if (open) {
      form.reset({
        patientId: initialPatientId || '',
        doctorId: '',
        date: new Date(),
        startTime: '',
        endTime: '',
        reason: '',
      });
      setPatientSearch('');
    }
  }, [open, initialPatientId, form]);

  const onSubmit = (data: AppointmentFormData) => {
    onAppointmentAdded({
      ...data,
      date: format(data.date, 'yyyy-MM-dd'),
    });
    setOpen(false);
  };

  const patientOptions = patients.map(p => ({ value: p.id, label: p.name }));
  const doctorOptions = doctors.map(d => ({ value: d.id, label: d.name }));

  const selectedDoctorId = form.watch("doctorId");
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>حجز موعد جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الموعد.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>المريض</FormLabel>
                  <Combobox
                    options={patientOptions}
                    selectedValue={field.value}
                    onSelectedValueChange={field.onChange}
                    placeholder="ابحث عن مريض..."
                    searchPlaceholder="اكتب اسم المريض..."
                    noResultsText="لم يتم العثور على مريض."
                    onSearchChange={setPatientSearch}
                    addNew={{
                      label: `إضافة مريض جديد باسم "${patientSearch}"`,
                      action: () => {
                        setOpen(false);
                        openNewPatientDialog({ initialName: patientSearch });
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="doctorId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>الطبيب</FormLabel>
                   <Combobox
                    options={doctorOptions}
                    selectedValue={field.value}
                    onSelectedValueChange={field.onChange}
                    placeholder="اختر الطبيب..."
                    searchPlaceholder="بحث عن طبيب..."
                    noResultsText="لم يتم العثور على طبيب."
                  />
                  {selectedDoctor && selectedDoctor.freeReturnPeriod && (
                    <p className="text-xs text-muted-foreground mt-1">
                      فترة العودة المجانية لهذا الطبيب: {selectedDoctor.freeReturnPeriod} يوم.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>التاريخ</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: require('date-fns/locale/ar-SA') })
                            ) : (
                              <span>اختر تاريخاً</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وقت البدء</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>وقت الانتهاء</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سبب الزيارة</FormLabel>
                  <FormControl>
                    <Input placeholder="فحص دوري" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="submit">حفظ الموعد</Button>
                <Button variant="outline" type="button" onClick={() => setOpen(false)}>إلغاء</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
