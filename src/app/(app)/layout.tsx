import { AppSidebar } from "@/components/layout/sidebar"
import { AppHeader } from "@/components/layout/header"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-background">
        <AppSidebar />
        <div className="flex flex-col sm:pl-14">
          <AppHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
