"use client"

import { IconChevronLeft, IconChevronRight, IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: (
    {
      title: string;
      url?: string;
      icon?: React.ElementType;
      items?: {
        title: string;
        url: string;
        icon?: React.ElementType;
      }[];
    }
  )[];
}) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  const normalizePath = (path: string) => path.endsWith('/') ? path.slice(0, -1) : path;
  const normalizedPathname = normalizePath(pathname);

  const toggleItem = (title: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.url && !item.items ? (
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <a href={item.url}>
                    {item.icon && <item.icon className="h-6 w-6 text-amber-600" />}
                    <span className="text-lg">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={item.items ? () => toggleItem(item.title) : undefined}
                  isActive={pathname === item.url}
                >
                  {item.icon && <item.icon className="h-6 w-6" />}
                  <span className="text-lg">{item.title}</span>
                  {item.items && (
                    <span className="ml-auto">
                      {openItems[item.title] ? <IconChevronLeft className="h-4 w-4" /> : <IconChevronRight className="h-4 w-4" />}
                    </span>
                  )}
                </SidebarMenuButton>
              )}
              {item.items && openItems[item.title] && (
                <div className="ml-4">
                  <SidebarGroupContent className="flex flex-col gap-2 pl-2">
                    {item.items.map((subItem) => (
                      <SidebarMenuButton key={subItem.title} tooltip={subItem.title} asChild isActive={normalizedPathname === subItem.url}>
                        <a href={subItem.url}>
                          {subItem.icon && <subItem.icon className="h-6 w-6" />}
                          <span className="text-lg">{subItem.title}</span>
                        </a>
                      </SidebarMenuButton>
                    ))}
                  </SidebarGroupContent>
                </div>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
