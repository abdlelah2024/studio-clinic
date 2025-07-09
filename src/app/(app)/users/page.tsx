
"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { mockUser } from "@/lib/data"
import type { User } from "@/lib/types"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { AddUserDialog } from "@/components/users/add-user-dialog"
import { EditUserDialog } from "@/components/users/edit-user-dialog"
import { DeleteUserDialog } from "@/components/users/delete-user-dialog"

// For demonstration, we'll create a small list of users.
const initialUsers: User[] = [
  mockUser,
  { name: "د. بن هانسون", email: "ben.h@clinicflow.demo", avatar: "https://placehold.co/100x100/A5D8FF/000000.png?text=B", role: "Doctor" },
  { name: "علياء منصور", email: "alia.m@clinicflow.demo", avatar: "https://placehold.co/100x100/FFC0CB/000000.png?text=A", role: "Receptionist" },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);

  const handleAddUser = (newUser: Omit<User, 'avatar'>) => {
    const userWithAvatar: User = {
      ...newUser,
      avatar: `https://placehold.co/100x100/E0E0E0/000000.png?text=${newUser.name.charAt(0)}`
    }
    setUsers(prev => [...prev, userWithAvatar]);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prev => prev.map(user => user.email === updatedUser.email ? updatedUser : user));
  }

  const handleDeleteUser = (email: string) => {
    setUsers(prev => prev.filter(user => user.email !== email));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>المستخدمون</CardTitle>
            <CardDescription>إدارة حسابات المستخدمين والأذونات.</CardDescription>
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
                <TableCell>
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
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>تعديل</DropdownMenuItem>
                       </EditUserDialog>
                      <DropdownMenuItem>إدارة الصلاحيات</DropdownMenuItem>
                      <DropdownMenuSeparator />
                       <DeleteUserDialog user={user} onDelete={() => handleDeleteUser(user.email)}>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">حذف</DropdownMenuItem>
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
  )
}
