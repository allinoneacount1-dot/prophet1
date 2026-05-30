import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

export function AppShell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        <Sidebar />
      </div>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/70 backdrop-blur transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      >
        <div
          className={cn(
            "absolute inset-y-0 left-0 transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <div className="lg:pl-72">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}