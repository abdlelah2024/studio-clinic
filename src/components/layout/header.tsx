
"use client"
import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Bell, CircleUser, LogOut, Search, User, Stethoscope, Calendar, PlusCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppContext } from "@/context/app-context"

export function AppHeader() {
  const { notifications, currentUser, logout, patients, doctors, openNewAppointmentDialog, openNewPatientDialog } = useAppContext()
  const router = useRouter()
  const [openCommand, setOpenCommand] = useState(false)

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_patient': return <CircleUser className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
  }

  const handleQuickAction = (action: () => void) => {
    action();
    setOpenCommand(false);
  }


  return (
    <>
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
         <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={() => setOpenCommand(true)}>
            <Search className="h-4 w-4 mr-2" />
            بحث سريع... (Ctrl+B)
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[350px]">
                <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1">
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                             <p className="text-xs text-muted-foreground mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
                 {notifications.length === 0 && (
                    <DropdownMenuItem>
                        <p className="text-sm text-muted-foreground text-center w-full">لا توجد إشعارات جديدة.</p>
                    </DropdownMenuItem>
                )}
                 <DropdownMenuSeparator />
                 <DropdownMenuItem className="justify-center text-primary">
                    عرض جميع الإشعارات
                 </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} data-ai-hint="doctor person" />
                <AvatarFallback>
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-bold">{currentUser?.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser?.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/settings')}>الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem>الفواتير</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push('/settings')}>الإعدادات</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>

    <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
        <CommandInput placeholder="ابحث عن مريض، طبيب، أو إجراء..."/>
        <CommandList>
            <CommandEmpty>لا توجد نتائج.</CommandEmpty>
            <CommandGroup heading="المرضى">
                {patients.slice(0, 5).map(patient => (
                    <CommandItem key={patient.id} value={`patient ${patient.name}`} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                           <User className="h-4 w-4" />
                           <span>{patient.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => handleQuickAction(() => router.push(`/patients/${patient.id}`))}>
                                <FileText className="h-4 w-4 mr-1"/> عرض السجل
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleQuickAction(() => openNewAppointmentDialog({initialPatientId: patient.id}))}>
                                <Calendar className="h-4 w-4 mr-1"/> موعد سريع
                            </Button>
                        </div>
                    </CommandItem>
                ))}
            </CommandGroup>
            <CommandGroup heading="الأطباء">
                 {doctors.slice(0,5).map(doctor => (
                     <CommandItem key={doctor.id} value={`doctor ${doctor.name}`} onSelect={() => handleQuickAction(() => router.push('/doctors'))}>
                        <Stethoscope className="h-4 w-4" />
                        <span>{doctor.name}</span>
                    </CommandItem>
                 ))}
            </CommandGroup>
             <CommandGroup heading="الإجراءات">
                <CommandItem onSelect={() => handleQuickAction(() => openNewAppointmentDialog())}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>موعد جديد</span>
                </CommandItem>
                <CommandItem onSelect={() => handleQuickAction(() => openNewPatientDialog())}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>إضافة مريض جديد</span>
                </CommandItem>
            </CommandGroup>
        </CommandList>
    </CommandDialog>
    </>
  )
}
