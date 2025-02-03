'use client';

import {
  ChevronUp,
  Home,
  User2,
  Book,
  Clipboard,
  Calendar1,
} from "lucide-react";

import useAuthStore from "@/store/auth/AuthStore";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Cursos",
    url: "/courses",
    icon: Book,
  },
  {
    title: "Progreso",
    url: "/progress",
    icon: Clipboard,
  },
  {
    title: "Calendario",
    url: "/calendar",
    icon: Calendar1,
  },

];

export function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogOut = () => {
    logout()
  }

  if (!isAuthenticated) {
    return (
      <div className="hidden">
      </div>
    );
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Image
              src="/isitech.png"
              width={100}
              height={100}
              alt="iconIsitech"
              className="mt-2"
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Campus Virtual</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="ml-[-10px]">
        <SidebarGroup>
          <SidebarGroupLabel>Usuario</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                      <User2 /> {user?.name}
                      <ChevronUp className="ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width]"
                  >
                    <Link href="/settings">
                      <DropdownMenuItem>
                        <span>Cuenta</span>
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/billing">
                    <DropdownMenuItem>
                        <span>Facturación</span>
                    </DropdownMenuItem>
                    </Link>
                    <Link href="/">
                      <DropdownMenuItem onClick={handleLogOut}>
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
