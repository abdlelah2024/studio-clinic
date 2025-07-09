
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
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

interface AddFieldDialogProps {
  children: React.ReactNode;
  onFieldAdded: (field: { label: string, required: boolean }) => void;
}

export function AddFieldDialog({ children, onFieldAdded }: AddFieldDialogProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!label) {
      toast({
        title: "خطأ",
        description: "يجب إدخال اسم للحقل.",
        variant: "destructive",
      });
      return;
    }
    
    onFieldAdded({ label, required });
    setOpen(false);
    setLabel("");
    setRequired(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إضافة حقل بيانات جديد</DialogTitle>
          <DialogDescription>
            إنشاء حقل مخصص جديد لسجلات المرضى.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              اسم الحقل
            </Label>
            <Input id="label" placeholder="على سبيل المثال، 'الحساسية'" className="col-span-3" value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div className="flex items-center space-x-2 space-x-reverse justify-center">
            <Checkbox id="required" checked={required} onCheckedChange={(checked) => setRequired(!!checked)} />
            <Label htmlFor="required">هل هذا الحقل مطلوب؟</Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>حفظ الحقل</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
