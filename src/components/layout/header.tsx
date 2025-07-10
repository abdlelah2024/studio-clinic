
"use client"
import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, Calendar, UserPlus, CircleUser, CalendarCheck, CalendarX2, Stethoscope, User, ArrowRight, LogOut } from "lucide-react"
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useAppContext } from "@/context/app-context"
import { Badge } from "../ui/badge"

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { patients, doctors, enrichedAppointments, openNewAppointmentDialog, openNewPatientDialog, notifications, currentUser, logout } = useAppContext()
  const router = useRouter()

  const searchResults = useMemo(() => {
    if (!searchQuery) return { patients: [], doctors: [], appointments: [] };

    const lowerCaseQuery = searchQuery.toLowerCase();

    const filteredPatients = patients.filter(
      p => p.name.toLowerCase().includes(lowerCaseQuery) || p.phone.includes(lowerCaseQuery)
    );

    const filteredDoctors = doctors.filter(
      d => d.name.toLowerCase().includes(lowerCaseQuery) || d.specialty.toLowerCase().includes(lowerCaseQuery)
    );

    const filteredAppointments = enrichedAppointments.filter(a => 
        a.patient.name.toLowerCase().includes(lowerCaseQuery) ||
        a.doctor.name.toLowerCase().includes(lowerCaseQuery) ||
        a.reason.toLowerCase().includes(lowerCaseQuery)
    );

    return { 
        patients: filteredPatients.slice(0, 3), 
        doctors: filteredDoctors.slice(0, 3),
        appointments: filteredAppointments.slice(0, 3)
    };
  }, [searchQuery, patients, doctors, enrichedAppointments]);

  const hasResults = searchResults.patients.length > 0 || searchResults.doctors.length > 0 || searchResults.appointments.length > 0;

  const resetSearch = useCallback(() => {
    setIsSearchFocused(false)
    setSearchQuery("")
  }, []);

  const handleNavigation = useCallback((path: string) => {
    router.push(path);
    resetSearch();
  }, [router, resetSearch]);
  
  const handleQuickAppointment = useCallback((patientId: string) => {
      openNewAppointmentDialog({ initialPatientId: patientId });
      resetSearch();
  }, [openNewAppointmentDialog, resetSearch]);
  
  const handleNewAppointment = useCallback(() => {
    openNewAppointmentDialog();
    resetSearch();
  }, [openNewAppointmentDialog, resetSearch]);

  const handleNewPatient = useCallback(() => {
    openNewPatientDialog({ initialName: searchQuery });
    resetSearch();
  }, [openNewPatientDialog, resetSearch, searchQuery]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        resetSearch()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [resetSearch])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed': return <CalendarCheck className="h-4 w-4 text-green-500" />;
      case 'appointment_canceled': return <CalendarX2 className="h-4 w-4 text-red-500" />;
      case 'new_patient': return <CircleUser className="h-4 w-4 text-blue-500" />;
      default: return <Bell className="h-4 w-4" />;
    }
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
            placeholder="بحث سريع (مرضى, أطباء, مواعيد)..."
            className="w-full rounded-lg bg-background pl-8 md:w-[280px] lg:w-[400px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {isSearchFocused && (
            <Command className="absolute top-full mt-2 w-full rounded-lg border bg-card shadow-lg md:w-[400px] lg:w-[550px]">
              <CommandList>
                {searchQuery && hasResults && (
                    <>
                    {searchResults.patients.length > 0 && (
                        <CommandGroup heading="المرضى">
                            {searchResults.patients.map((patient) => (
                            <CommandItem key={`p-${patient.id}`} value={`patient-${patient.id}`} className="p-2 flex justify-between items-center" onSelect={() => setIsSearchFocused(false)}>
                                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation(`/patients/${patient.id}`)}>
                                    <User className="h-4 w-4" />
                                    <div>
                                        <p className="font-medium">{patient.name}</p>
                                        <p className="text-xs text-muted-foreground">{patient.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => handleNavigation(`/patients/${patient.id}`)}>
                                        عرض السجل
                                    </Button>
                                    <Button variant="secondary" size="sm" onClick={() => handleQuickAppointment(patient.id)}>موعد سريع</Button>
                                </div>
                            </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {searchResults.doctors.length > 0 && (
                        <CommandGroup heading="الأطباء">
                            {searchResults.doctors.map((doctor) => (
                            <CommandItem key={`d-${doctor.id}`} value={`doctor-${doctor.id}`} onSelect={() => handleNavigation(`/doctors`)} className="p-2 cursor-pointer">
                                <Stethoscope className="mr-2 h-4 w-4" />
                                <div>
                                    <p className="font-medium">{doctor.name}</p>
                                    <p className="text-xs text-muted-foreground">{doctor.specialty}</p>
                                </div>
                            </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    {searchResults.appointments.length > 0 && (
                        <CommandGroup heading="المواعيد">
                            {searchResults.appointments.map((appointment) => (
                            <CommandItem key={`a-${appointment.id}`} value={`appointment-${appointment.id}`} onSelect={() => handleNavigation('/appointments')} className="p-2 cursor-pointer">
                                <Calendar className="mr-2 h-4 w-4" />
                                <div className="flex-1">
                                    <p className="font-medium">{appointment.patient.name}</p>
                                    <p className="text-xs text-muted-foreground">مع {appointment.doctor.name} - {appointment.reason}</p>
                                </div>
                                <Badge variant="outline">{appointment.date}</Badge>
                            </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    </>
                )}
                 {searchQuery && !hasResults && (
                    <CommandEmpty>
                        <div onClick={handleNewPatient} className="flex-col items-center justify-center py-4 cursor-pointer">
                             <p>لم يتم العثور على مريض. هل تريد إضافة واحد جديد؟</p>
                             <div className="flex items-center justify-center text-primary mt-2">
                                <UserPlus className="mr-2 h-4 w-4" /> إضافة مريض جديد
                            </div>
                        </div>
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
            <DropdownMenuItem onSelect={() => handleNavigation('/settings')}>الملف الشخصي</DropdownMenuItem>
            <DropdownMenuItem>الفواتير</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleNavigation('/settings')}>الإعدادات</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              تسجيل الخروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
