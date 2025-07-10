
"use client"
import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Search, Calendar, UserPlus, CircleUser, CalendarCheck, CalendarX2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { mockUser } from "@/lib/data"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useAppContext } from "@/context/app-context"
import { useRouter } from "next/navigation"

const mockNotifications = [
    {
        icon: <CalendarCheck className="h-4 w-4 text-green-500" />,
        title: "تم تأكيد الموعد",
        description: "تم تأكيد موعد أحمد محمود.",
        time: "قبل 5 دقائق",
    },
    {
        icon: <CalendarX2 className="h-4 w-4 text-red-500" />,
        title: "تم إلغاء الموعد",
        description: "تم إلغاء موعد فاطمة علي.",
        time: "قبل ساعة",
    },
    {
        icon: <CircleUser className="h-4 w-4 text-blue-500" />,
        title: "مريض جديد مسجل",
        description: "تم تسجيل خالد عبد الله كمريض جديد.",
        time: "أمس",
    },
];


export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { patients, openNewAppointmentDialog, openNewPatientDialog } = useAppContext()
  const router = useRouter()

  const filteredPatients = searchQuery
    ? patients.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.phone.includes(searchQuery)
      )
    : []

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const resetSearch = () => {
    setIsSearchFocused(false)
    setSearchQuery("")
  }
  
  const handleQuickAppointment = (patientId: string) => {
      openNewAppointmentDialog({ initialPatientId: patientId });
      resetSearch();
  }

  const handlePatientSelect = (patientId: string) => {
    router.push(`/patients/${patientId}`);
    resetSearch();
  }
  
  const handleNewAppointment = () => {
    openNewAppointmentDialog();
    resetSearch();
  };

  const handleNewPatient = () => {
    openNewPatientDialog();
    resetSearch();
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        <div className="relative" ref={searchRef}>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="بحث سريع عن مريض بالاسم أو الرقم..."
            className="w-full rounded-lg bg-background pl-8 md:w-[280px] lg:w-[320px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {isSearchFocused && (
            <Command className="absolute top-full mt-2 w-full rounded-lg border bg-card shadow-lg md:w-[320px] lg:w-[450px]">
              <CommandList>
                {searchQuery && filteredPatients.length > 0 && (
                  <CommandGroup heading="المرضى">
                    {filteredPatients.map((patient) => (
                      <div key={patient.id} className="p-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={patient.avatar} data-ai-hint="person face" />
                                    <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{patient.name}</p>
                                    <p className="text-xs text-muted-foreground">{patient.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <Button variant="secondary" size="sm" onClick={() => handleQuickAppointment(patient.id)}>
                                    موعد سريع
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handlePatientSelect(patient.id)}>
                                    عرض السجل
                                </Button>
                            </div>
                        </div>
                      </div>
                    ))}
                  </CommandGroup>
                )}
                 {searchQuery && filteredPatients.length === 0 && (
                    <CommandEmpty>
                        <CommandItem onSelect={handleNewPatient} className="flex-col items-center justify-center py-4 cursor-pointer">
                             <p>لم يتم العثور على مريض. هل تريد إضافة واحد جديد؟</p>
                             <div className="flex items-center text-primary mt-2">
                                <UserPlus className="mr-2 h-4 w-4" /> إضافة مريض جديد
                            </div>
                        </CommandItem>
                    </CommandEmpty>
                 )}

                {!searchQuery && (
                    <CommandGroup heading="إجراءات سريعة">
                        <CommandItem onSelect={handleNewAppointment} className="cursor-pointer">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>حجز موعد جديد</span>
                        </CommandItem>
                        <CommandItem onSelect={handleNewPatient} className="cursor-pointer">
                            <UserPlus className="mr-2 h-4 w-4" />
                            <span>إضافة مريض جديد</span>
                        </CommandItem>
                    </CommandGroup>
                )}
              </CommandList>
            </Command>
          )}
        </div>
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
                {mockNotifications.map((notification, index) => (
                    <DropdownMenuItem key={index} className="flex items-start gap-3">
                        <div className="mt-1">{notification.icon}</div>
                        <div className="flex-1">
                            <p className="font-semibold">{notification.title}</p>
                            <p className="text-xs text-muted-foreground">{notification.description}</p>
                             <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                    </DropdownMenuItem>
                ))}
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
                <AvatarImage src={mockUser.avatar} alt={mockUser.name} data-ai-hint="doctor person" />
                <AvatarFallback>
                  {mockUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="font-bold">{mockUser.name}</div>
              <div className="text-xs text-muted-foreground">{mockUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/settings">الملف الشخصي</Link></DropdownMenuItem>
            <DropdownMenuItem>الفواتير</DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">الإعدادات</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>تسجيل الخروج</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
