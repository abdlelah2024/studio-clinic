
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  BadgeHelp,
  BarChart3,
  HeartPulse,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  History,
  MessageSquare,
  Calendar
} from "lucide-react"

export function AppSidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
    { href: "/appointments", label: "إدارة المواعيد", icon: Calendar },
    { href: "/patients", label: "إدارة المرضى", icon: Users },
    { href: "/doctors", label: "إدارة الأطباء", icon: Stethoscope },
    { href: "/reports", label: "التقارير والإحصائيات", icon: BarChart3 },
    { href: "/messaging", label: "المراسلات", icon: MessageSquare },
    { href: "/audit-log", label: "مراقبة التعديلات", icon: History },
    { href: "/users", label: "المستخدمون والصلاحيات", icon: ShieldCheck },
    { href: "/settings", label: "الإعدادات", icon: Settings },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <HeartPulse className="text-primary size-8" />
          <h1 className="text-xl font-headline font-bold">ClinicFlow</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <BadgeHelp />
              <span>المساعدة والدعم</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
