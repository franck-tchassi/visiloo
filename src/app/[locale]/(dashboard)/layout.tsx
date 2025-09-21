import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { IconListDetails, IconPhoto, IconStar, IconWorldWww } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prismadb";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import React from "react"
import { DashboardClientWrapper } from "./DashboardClientWrapper";


export default async function DashboardLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const locale = params.locale;

  const currentUser = await getCurrentUser();
  // Supprimé: console.log('DashboardLayout - currentUser:', currentUser); // DEBUG

  if (!currentUser || !currentUser.id) {
    redirect('/login');
    return null;
  }

  if (!currentUser.currentOrganizationId) {
    // Supprimé: console.log('DashboardLayout - No currentOrganizationId for user:', currentUser.id); // DEBUG
    return (
      <div className="p-6 text-center text-gray-500">
        Veuillez sélectionner une organisation active pour gérer les membres.
      </div>
    );
  }

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId: currentUser.id
        }
      }
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });
  // Supprimé: console.log('DashboardLayout - Organizations:', organizations); // DEBUG
  // Supprimé: console.log('DashboardLayout - Current Organization ID from User:', currentUser.currentOrganizationId); // DEBUG
  // Supprimé: console.log('DashboardLayout - Current Organization ID for Wrapper:', currentUser?.currentOrganizationId); // Debugging

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader
          user={{ name: currentUser.name || currentUser.email || "", email: currentUser.email || "", avatar: currentUser.image || "https://github.com/shadcn.png" }}
          organizations={organizations}
          currentOrganizationId={currentUser.currentOrganizationId}
        />
        <DashboardClientWrapper>
          {children}
        </DashboardClientWrapper>
      </SidebarInset>
    </SidebarProvider>
  );
}
