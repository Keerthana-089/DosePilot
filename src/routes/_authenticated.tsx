import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app/AppSidebar";
import { AppTopbar } from "@/components/app/AppTopbar";
import { authApi } from "@/lib/store";
import { useReminderScheduler } from "@/lib/useReminderScheduler";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !authApi.current()) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  useReminderScheduler();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-surface">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-2 border-b border-border bg-background px-3 sticky top-0 z-30">
            <SidebarTrigger />
            <AppTopbar />
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
