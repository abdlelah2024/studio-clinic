
"use client"
import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Bell, Search, Calendar, UserPlus } from "lucide-react"
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
import { mockUser, mockPatients } from "@/lib/data"
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

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { openNewAppointmentDialog, openNewPatientDialog } = useAppContext()
  const router = useRouter()

  const filteredPatients = searchQuery
    ? mockPatients.filter(
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

  const handlePatientSelect = (patientId: string) => {
    router.push(`/patients/${patientId}`);
    resetSearch();
  }

  const handleNewAppointment = () => {
    openNewAppointmentDialog({onAppointmentAdded: () => {}});
    resetSearch();
  }
  
  const handleNewPatient = () => {
    openNewPatientDialog(()=>{});
    resetSearch();
  }

  const handleViewAllAppointments = () => {
    router.push('/appointments');
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
            placeholder="بحث سريع بالاسم أو الرقم..."
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
                      <CommandItem
                        key={patient.id}
                        onSelect={() => handlePatientSelect(patient.id)}
                      >
                         <Avatar className="mr-2 h-6 w-6">
                            <AvatarImage src={patient.avatar} data-ai-hint="person face" />
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{patient.name}</span>
                         <span className="text-xs text-muted-foreground ml-auto">{patient.phone}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                 {searchQuery && filteredPatients.length === 0 && (
                    <CommandEmpty>
                        <div className="p-4 text-center text-sm">
                            <p>لم يتم العثور على مريض بهذا الاسم/الرقم.</p>
                             <Button variant="link" className="mt-2" onMouseDown={(e) => e.preventDefault()} onClick={handleNewPatient}>
                                <UserPlus className="mr-2 h-4 w-4" /> إضافة مريض جديد
                            </Button>
                        </div>
                    </CommandEmpty>
                 )}

                <CommandGroup heading="إجراءات سريعة">
                  <CommandItem onSelect={handleNewAppointment}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>حجز موعد جديد</span>
                  </CommandItem>
                   <CommandItem onSelect={handleViewAllAppointments}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>عرض كل المواعيد</span>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
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
