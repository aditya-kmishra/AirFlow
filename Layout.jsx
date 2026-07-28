import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Play, BarChart3, GitCompare, Plane } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Live Simulation",
    url: createPageUrl("Simulation"),
    icon: Play,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Scenarios",
    url: createPageUrl("Scenarios"),
    icon: GitCompare,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --color-navy: #0A1628;
          --color-navy-light: #152238;
          --color-blue: #0EA5E9;
          --color-blue-light: #38BDF8;
          --color-accent: #06B6D4;
        }
      `}</style>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
        <Sidebar className="border-r border-slate-200/80 bg-white/80 backdrop-blur-xl">
          <SidebarHeader className="border-b border-slate-200/80 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-lg">AeroFlow</h2>
                <p className="text-xs text-slate-500">Airport Optimization</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 rounded-xl ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-slate-100 p-2 rounded-lg transition-colors" />
              <h1 className="text-xl font-bold text-slate-900">AeroFlow</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}