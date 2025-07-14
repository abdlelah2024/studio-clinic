
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { User, UserRole } from "@/lib/types"

interface EditUserDialogProps {
  children: React.ReactNode;
  user: User;
  onUserUpdated: (user: User) => void;
}

export function EditUserDialog({ children, user, onUserUpdated }: EditUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(user.name)
  const [role, setRole] = useState(user.role)
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (open) {
        setName(user.name);
        setRole(user.role);
        setPassword("");
    }
  }, [open, user]);
  
  const handleSubmit = () => {
    const updatedUser = { ...user, name, role };
    if (password) {
      // In a real app, you would handle password changes more securely,
      // potentially requiring re-authentication and using a backend function.
      // For this demo, we'll just update it in the context.
      console.warn("Password is being updated on the client-side for demo purposes. This is not secure.");
      (updatedUser as any).password = password;
    }
    onUserUpdated(updatedUser);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل المستخدم</DialogTitle>
          <DialogDescription>
            قم بتحديث تفاصيل المستخدم.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              البريد الإلكتروني
            </Label>
            <Input id="email" type="email" value={user.email} className="col-span-3" readOnly />
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              كلمة المرور
            </Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="col-span-3" placeholder="اتركه فارغًا لعدم التغيير" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              الدور
            </Label>
            <Select onValueChange={(value) => setRole(value as UserRole)} value={role}>
              <SelectTrigger className="col-span-3" disabled={user.role === 'Admin'}>
                <SelectValue placeholder="اختر دورًا" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">مدير</SelectItem>
                <SelectItem value="Doctor">طبيب</SelectItem>
                <SelectItem value="Receptionist">موظف استقبال</SelectItem>
              </SelectContent>
            </Select>
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
