import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { LayoutDashboard, Play, BarChart3, GitCompare, Plane, Bot } from "lucide-react";
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
  {
    title: "AI Assistant",
    url: createPageUrl("AiAssistant"),
    icon: Bot,
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
      <div className="min-h-screen flex w-full bg-background font-sans text-foreground">
        <Sidebar className="border-r border-border bg-card">
          <SidebarHeader className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center">
                <Plane className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-foreground text-xl">AeroFlow</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest mt-0.5">Optimization</p>
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
                        className={`hover:bg-accent hover:text-accent-foreground transition-all duration-200 rounded-md ${
                          location.pathname === item.url 
                            ? 'bg-secondary text-secondary-foreground font-medium' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-4 h-4" />
                          <span className="text-sm">{item.title}</span>
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
          <header className="bg-card border-b border-border px-6 py-4 lg:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted p-2 rounded-md transition-colors" />
              <h1 className="text-xl font-serif font-bold text-foreground">AeroFlow</h1>
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