"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconHomeStats,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutDashboard,
  IconMessages,
  IconUserPlus,
  IconFileInvoice,
  IconFileText,

} from "@tabler/icons-react"
import { PiShootingStarBold } from "react-icons/pi";
import { PiChatsCircleBold } from "react-icons/pi";
import { PiBuildingBold } from "react-icons/pi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { FaRegCalendarAlt } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { BsImages } from "react-icons/bs";
import { FaUsers } from "react-icons/fa";

import { MdOutlineLocalOffer } from "react-icons/md";
import { VscFiles } from "react-icons/vsc";

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import { Megaphone } from "lucide-react";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  onSearchClick: () => void;
}

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconLayoutDashboard, // Changer l'icône ici
    },
    {
      title: "Établissements",
      url: "/dashboard/etablisment",
      icon: PiBuildingBold, // Changer l'icône ici
    },
    {
      title: "Leads",
      url: "/dashboard/leads",
      icon: IconUserPlus, // Changer l'icône ici
    },
    {
      title: "Avis",
      url: "/dashboard/reviews",
      icon: PiShootingStarBold, // Utiliser une icône appropriée pour "Avis"
    },
    {
      title: "Contenu",

      icon: FaRegCalendarAlt,
      items: [
        {
          title: "Photos",
          url: "/dashboard/pictures",
          icon: BsImages,
        },
        {
          title: "Publications",
          url: "/dashboard/posts",
          icon: VscFiles,
        },
        {
          title: "Offres",
          url: "/dashboard/offers",
          icon: MdOutlineLocalOffer,
        },
      ],
    },
    {
      title: "Videos IA",

      icon: FaRegCalendarAlt,
      items: [
        {
          title: "Creative Tools",
          url: "/dashboard/creative-tools",
          icon: BsImages,
        },
        {
          title: "My Ads",
          url: "/dashboard/my-ads",
          icon: Megaphone,
        },
      ],
    },
    {
      title: "Messages",
      url: "/dashboard/messages",
      icon: PiChatsCircleBold,
    },
    {
      title: "Annuaire",
      url: "/dashboard/directory",
      icon: CiViewList,
    },
    {
      title: "Factures",
      url: "/dashboard/invoices",
      icon: IconFileText,
    },
    {
      title: "Membres",
      url: "/dashboard/members",
      icon: FaUsers,
    },
    {
      title: "Audit",
      url: "/dashboard/audit",
      icon: AiOutlineFileSearch,
    },

    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [

    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],

}

export function AppSidebar({ onSearchClick, ...props }: AppSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const updatedNavSecondary = data.navSecondary.map((item) => {
    if (item.title === "Search") {
      return { ...item, url: undefined, onClick: onSearchClick };
    }
    return item;
  });

  return (
    <Sidebar collapsible={isCollapsed ? "icon" : "offcanvas"} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent active:bg-transparent w-fit hover:translate-x-0 hover:scale-100"
            >
              <a href="/dashboard">
                <Image
                  src="/logo/visiloo.png"
                  alt="Vidsnap Logo"
                  width={40}
                  height={40}
                  className="!size-10"
                />
                <span className="text-2xl font-semibold text-amber-600">Visiloo</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onSearchClick}>
            <IconSearch />
            <span className="text-lg">Rechercher</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  )
}
