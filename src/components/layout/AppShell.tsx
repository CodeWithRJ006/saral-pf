"use strict";
"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Check, AlertTriangle, LogOut } from "lucide-react";
import { useScenario, ScenarioType } from "@/context/ScenarioContext";
import { cn } from "@/lib/utils";
import { SaralAssistant } from "@/components/SaralAssistant";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/claims", label: "Claims" },
  { href: "/passbook", label: "Passbook" },
  { href: "/profile", label: "Profile" },
  { href: "/grievance", label: "Grievances" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { scenario, setScenario } = useScenario();
  const logout = () => { window.location.href = "/"; };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0] text-[#131215]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#131215]/10 bg-[#F7F5F0] px-6">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <motion.div 
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-[#2c524b] group-hover:bg-[#131215] transition-colors" 
          />
          <span className="font-serif text-2xl italic font-medium tracking-tight text-[#131215]">Saral.</span>
        </Link>

        <div className="flex items-center gap-6">
          <button onClick={logout} className="hidden sm:flex items-center gap-1.5 text-[10px] font-medium tracking-widest uppercase text-[#131215]/40 hover:text-[#131215] transition-colors">
            Exit
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="w-64 border-r border-[#131215]/10 bg-[#F7F5F0] hidden md:flex md:flex-col justify-between">
          <nav className="space-y-6 mt-10 px-6">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block text-xs font-medium tracking-widest uppercase transition-colors",
                    isActive ? "text-[#131215]" : "text-[#131215]/40 hover:text-[#131215]"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-6 border-t border-[#131215]/10">
            <button 
              onClick={logout}
              className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-[#131215]/40 hover:text-[#131215] transition-colors"
            >
              <LogOut className="h-3 w-3" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden relative">
          <div className="mx-auto max-w-5xl p-4 sm:p-8 md:p-12 pb-40 md:pb-32">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-[4.5rem] items-center justify-around border-t border-[#131215]/10 bg-[#F7F5F0] md:hidden pb-5 px-2">
        {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3]].map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-[10px] font-medium tracking-widest uppercase transition-colors",
                isActive ? "text-[#131215]" : "text-[#131215]/40"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={logout}
          className="flex flex-col items-center justify-center w-full h-full text-[10px] font-medium tracking-widest uppercase transition-colors text-[#131215]/40 hover:text-[#131215]"
        >
          Exit
        </button>
      </div>

      <SaralAssistant />
    </div>
  );
}
