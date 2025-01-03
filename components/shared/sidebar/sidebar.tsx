'use client';

import {
  ChevronUp,
  Home,
  Settings,
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
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },

];

export function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  console.log(isAuthenticated, user)

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
                    <a
                      href={item.url}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
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
                    <DropdownMenuItem>
                      <span>Cuenta</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <span>Facturación</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogOut}>
                      <span>Cerrar sesión</span>
                    </DropdownMenuItem>
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
