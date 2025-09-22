"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Search, User } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { OrganizationSwitcher } from "@/components/organization-switcher";

interface Organization {
  id: string;
  name: string;
}

interface SiteHeaderProps {
  user: { name: string; email: string; avatar: string };
  // onSearchClick: () => void; // Supprimé car la logique est déplacée
  organizations: Organization[];
  currentOrganizationId: string | null | undefined;
}

export function SiteHeader({ user, organizations, currentOrganizationId }: SiteHeaderProps) {
  // const pathname = usePathname(); // Déplacé vers DashboardClientWrapper
  console.log('SiteHeader - Props organizations:', organizations); // DEBUG
  console.log('SiteHeader - Props currentOrganizationId:', currentOrganizationId); // DEBUG

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-sm transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className="flex flex-1 justify-center">
          <OrganizationSwitcher
            organizations={organizations}
            currentOrganizationId={currentOrganizationId}
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">3</span>
          </Button>

          <NavUser user={user} />
        </div>
      </div>
    </header>
  )
}
