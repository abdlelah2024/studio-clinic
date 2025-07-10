
'use client';
import { AppSidebar } from "@/components/layout/sidebar"
import { AppHeader } from "@/components/layout/header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppProvider } from "@/context/app-context"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-background">
        <div className="flex flex-col sm:pl-[5.4rem]">
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
            <Skeleton className="h-8 w-8 rounded-full md:hidden" />
            <Skeleton className="h-8 w-1/2 md:w-[400px]" />
            <div className="flex-1" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </header>
          <main className="flex-1 p-4 sm:px-6 sm:py-4 md:p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/4" />
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </main>
        </div>
      </div>
    );
  }
  
  return (
    <AppProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full flex-col bg-background">
            <AppSidebar />
            <div className="flex flex-col sm:pl-[5.4rem]">
              <AppHeader />
              <main className="flex-1 p-4 sm:px-6 sm:py-4 md:p-6">{children}</main>
            </div>
          </div>
        </SidebarProvider>
    </AppProvider>
  )
}
