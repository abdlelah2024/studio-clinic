
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreVertical, PlusCircle, Trash2, Edit } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { AddFieldDialog } from "@/components/settings/add-field-dialog"
import { EditFieldDialog } from "@/components/settings/edit-field-dialog"
import { DeleteFieldDialog } from "@/components/settings/delete-field-dialog"
import { useToast } from "@/hooks/use-toast"

type DataField = {
  id: string;
  label: string;
  type: 'نظام' | 'مخصص';
  required: boolean;
};

const initialDataFields: DataField[] = [
    { id: "patient-name", label: "اسم المريض", type: "نظام", required: true },
    { id: "dob", label: "تاريخ الميلاد", type: "نظام", required: true },
    { id: "phone", label: "رقم الهاتف", type: "نظام", required: true },
    { id: "email", label: "البريد الإلكتروني", type: "نظام", required: false },
    { id: "blood-type", label: "فصيلة الدم", type: "مخصص", required: false },
]

export default function SettingsPage() {
  const [dataFields, setDataFields] = useState<DataField[]>(initialDataFields);
  const { toast } = useToast();

  const handleAddField = (field: { label: string, required: boolean }) => {
    const newField: DataField = {
      ...field,
      id: `custom-${dataFields.length + 1}`,
      type: 'مخصص',
    };
    setDataFields(prev => [...prev, newField]);
    toast({
      title: "تمت إضافة الحقل بنجاح",
      description: `تمت إضافة حقل "${field.label}".`,
    });
  };

  const handleUpdateField = (updatedField: DataField) => {
    setDataFields(prev => prev.map(f => f.id === updatedField.id ? updatedField : f));
     toast({
      title: "تم تحديث الحقل بنجاح",
      description: `تم تحديث حقل "${updatedField.label}".`,
    });
  };

  const handleDeleteField = (fieldId: string) => {
    const fieldLabel = dataFields.find(f => f.id === fieldId)?.label;
    setDataFields(prev => prev.filter(f => f.id !== fieldId));
    toast({
      title: "تم حذف الحقل بنجاح",
      description: `تم حذف حقل "${fieldLabel}".`,
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-headline">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات وتفضيلات عيادتك.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">الملف الشخصي</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="notifications">الإشعارات</TabsTrigger>
          <TabsTrigger value="data">حقول البيانات</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>ملف العيادة الشخصي</CardTitle>
              <CardDescription>تحديث المعلومات العامة لعيادتك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">اسم العيادة</Label>
                <Input id="clinic-name" defaultValue="عيادة فلو التجريبية" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clinic-contact">البريد الإلكتروني للاتصال</Label>
                <Input id="clinic-contact" type="email" defaultValue="contact@clinicflow.demo" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>المظهر</CardTitle>
              <CardDescription>تخصيص شكل ومظهر التطبيق.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>السمة</Label>
                <p className="text-sm text-muted-foreground">اختر سمة للتطبيق. يتم التعامل مع الوضع الداكن تلقائيًا بواسطة تفضيلات نظامك.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">اللغة</Label>
                 <Select defaultValue="ar">
                  <SelectTrigger id="language" className="w-[280px]">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>الإشعارات</CardTitle>
              <CardDescription>إدارة كيفية تلقي الإشعارات.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">تذكيرات المواعيد</p>
                        <p className="text-sm text-muted-foreground">إرسال تذكيرات عبر البريد الإلكتروني للمرضى قبل 24 ساعة من موعدهم.</p>
                    </div>
                    <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-4 rounded-md border p-4">
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">ملخص يومي</p>
                        <p className="text-sm text-muted-foreground">تلقي ملخص يومي عبر البريد الإلكتروني للمواعيد والمهام.</p>
                    </div>
                    <Switch />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="data">
           <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>حقول البيانات</CardTitle>
                        <CardDescription>تخصيص حقول البيانات للمواعيد وسجلات المرضى.</CardDescription>
                    </div>
                    <AddFieldDialog onFieldAdded={handleAddField}>
                      <Button size="sm" className="gap-1">
                          <PlusCircle className="h-3.5 w-3.5" />
                          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                              إضافة حقل
                          </span>
                      </Button>
                    </AddFieldDialog>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>اسم الحقل</TableHead>
                            <TableHead>النوع</TableHead>
                            <TableHead>مطلوب</TableHead>
                            <TableHead className="text-right"><span className="sr-only">الإجراءات</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dataFields.map((field) => (
                            <TableRow key={field.id}>
                                <TableCell className="font-medium">{field.label}</TableCell>
                                <TableCell>{field.type}</TableCell>
                                <TableCell>
                                    <Checkbox checked={field.required} disabled={field.type === 'نظام'} />
                                </TableCell>
                                <TableCell className="text-right">
                                     {field.type !== 'نظام' && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <EditFieldDialog field={field} onFieldUpdated={handleUpdateField}>
                                                    <DropdownMenuItem onSelect={e => e.preventDefault()}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        تعديل
                                                    </DropdownMenuItem>
                                                </EditFieldDialog>
                                                <DeleteFieldDialog field={field} onDelete={() => handleDeleteField(field.id)}>
                                                    <DropdownMenuItem onSelect={e => e.preventDefault()} className="text-destructive">
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        حذف
                                                    </DropdownMenuItem>
                                                </DeleteFieldDialog>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                     )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
