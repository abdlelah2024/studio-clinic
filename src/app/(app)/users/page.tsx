
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUser, initialPermissions, otherUsers } from "@/lib/data"
import type { User, UserRole, Permissions } from "@/lib/types"
import { MoreHorizontal, PlusCircle, Edit, Trash2, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { EditUserDialog } from "@/components/users/edit-user-dialog"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const initialUsers: User[] = [mockUser, ...otherUsers];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [permissions, setPermissions] = useState<Record<UserRole, Permissions>>(initialPermissions);
  const { toast } = useToast();

  const handleAddUser = (user: Omit<User, 'avatar' | 'status'>) => {
    const newUser: User = {
      ...user,
      avatar: `https://placehold.co/100x100?text=${user.name.charAt(0)}`,
      status: 'offline',
    };
    setUsers(prev => [newUser, ...prev]);
    toast({
      title: "تمت الإضافة بنجاح",
      description: `تمت إضافة المستخدم ${user.name}.`,
    });
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.email === updatedUser.email ? updatedUser : u));
     toast({
      title: "تم التحديث بنجاح",
      description: `تم تحديث بيانات المستخدم ${updatedUser.name}.`,
    });
  };

  const handleDeleteUser = (email: string) => {
    const userName = users.find(u => u.email === email)?.name;
    setUsers(prev => prev.filter(u => u.email !== email));
     toast({
      title: "تم الحذف بنجاح",
      description: `تم حذف المستخدم ${userName}.`,
      variant: "destructive"
    });
  };

  const handlePermissionChange = (role: UserRole, section: keyof Permissions, action: keyof Permissions[keyof Permissions], value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [section]: {
          ...prev[role][section],
          [action]: value,
        },
      },
    }));
  };
  
  const permissionSections: { key: keyof Permissions, label: string }[] = [
      { key: 'patients', label: 'المرضى' },
      { key: 'doctors', label: 'الأطباء' },
      { key: 'appointments', label: 'المواعيد' },
      { key: 'users', label: 'المستخدمون' },
  ];

  const permissionActions: { key: keyof Permissions['patients'], label: string }[] = [
      { key: 'add', label: 'إضافة' },
      { key: 'edit', label: 'تعديل' },
      { key: 'delete', label: 'حذف' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>إدارة المستخدمين</CardTitle>
              <CardDescription>إدارة حسابات المستخدمين وأدوارهم الأساسية.</CardDescription>
            </div>
            <AddUserDialog onUserAdded={handleAddUser}>
              <Button size="sm" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  إضافة مستخدم
                </span>
              </Button>
            </AddUserDialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الاسم</TableHead>
                <TableHead>البريد الإلكتروني</TableHead>
                <TableHead>الدور</TableHead>
                <TableHead>
                  <span className="sr-only">الإجراءات</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person face" />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">{user.name}</div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                      <Badge variant={user.role === 'Admin' ? 'destructive' : 'secondary'}>
                          {user.role === 'Admin' ? 'مدير' : user.role === 'Doctor' ? 'طبيب' : 'موظف استقبال'}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                        <EditUserDialog user={user} onUserUpdated={handleUpdateUser}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Edit className="mr-2 h-4 w-4" />
                              تعديل
                          </DropdownMenuItem>
                        </EditUserDialog>
                        <DropdownMenuSeparator />
                        <DeleteUserDialog user={user} onDelete={() => handleDeleteUser(user.email)}>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()} disabled={user.role === 'Admin'}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              حذف
                          </DropdownMenuItem>
                        </DeleteUserDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>إدارة الصلاحيات</CardTitle>
          <CardDescription>تحديد الصلاحيات لكل دور في النظام.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(Object.keys(permissions) as UserRole[]).map(role => (
              <Card key={role}>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        {role === 'Admin' ? 'مدير' : role === 'Doctor' ? 'طبيب' : 'موظف استقبال'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {permissionSections.map(section => (
                    <div key={section.key}>
                        <Label className="font-semibold">{section.label}</Label>
                        <div className="space-y-2 mt-2">
                          {permissionActions.map(action => (
                              <div key={action.key} className="flex items-center gap-2">
                                <Checkbox 
                                    id={`${role}-${section.key}-${action.key}`} 
                                    checked={permissions[role][section.key][action.key as keyof typeof permissions.Admin.patients]}
                                    onCheckedChange={(checked) => handlePermissionChange(role, section.key, action.key as keyof typeof permissions.Admin.patients, !!checked)}
                                    disabled={role === 'Admin'}
                                />
                                <Label htmlFor={`${role}-${section.key}-${action.key}`} className="text-sm font-normal">{action.label}</Label>
                              </div>
                          ))}
                           {section.key === 'appointments' && (
                             <div className="flex items-center gap-2">
                                <Checkbox 
                                    id={`${role}-${section.key}-cancel`} 
                                    checked={permissions[role].appointments.cancel}
                                    onCheckedChange={(checked) => handlePermissionChange(role, 'appointments', 'cancel', !!checked)}
                                    disabled={role === 'Admin'}
                                />
                                <Label htmlFor={`${role}-${section.key}-cancel`} className="text-sm font-normal">إلغاء</Label>
                              </div>
                          )}
                        </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
