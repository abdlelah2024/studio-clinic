
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
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

type DataField = {
  id: string;
  label: string;
  type: 'نظام' | 'مخصص';
  required: boolean;
};

interface EditFieldDialogProps {
  children: React.ReactNode;
  field: DataField;
  onFieldUpdated: (field: DataField) => void;
}

export function EditFieldDialog({ children, field, onFieldUpdated }: EditFieldDialogProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(field.label);
  const [required, setRequired] = useState(field.required);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setLabel(field.label);
      setRequired(field.required);
    }
  }, [open, field]);

  const handleSubmit = () => {
    if (!label) {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم للحقل.",
        variant: "destructive",
      });
      return;
    }
    
    onFieldUpdated({ ...field, label, required });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل حقل البيانات</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل الحقل المخصص.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              اسم الحقل
            </Label>
            <Input id="label" value={label} onChange={(e) => setLabel(e.target.value)} className="col-span-3" />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse justify-center">
            <Checkbox id="required" checked={required} onCheckedChange={(checked) => setRequired(!!checked)} />
            <Label htmlFor="required">هل هذا الحقل مطلوب؟</Label>
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
