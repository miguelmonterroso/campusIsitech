"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/auth/AuthStore";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "@/components/shared/sidebar/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import CoursesComponent from "@/components/shared/dashboard/coursesComponent";
import ProgressComponent from "@/components/shared/dashboard/progressComponent";
import SettingComponent from "@/components/shared/dashboard/settingComponent";
import DashboardComponent from "@/components/shared/dashboard/dashboardComponent";
import BlurFade from "@/components/ui/blur-fade";

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Dashboard"); // Estado para la sección seleccionada

  useEffect(() => {
    const rehydratedState = localStorage.getItem("auth-storage");

    if (rehydratedState) {
      const parsedState = JSON.parse(rehydratedState);
      if (parsedState.state.isAuthenticated) {
        setIsLoading(false);
      } else {
        setIsLoading(false);
        router.push("/auth");
      }
    } else {
      setIsLoading(false);
      router.push("/auth");
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h2 className="text-xl font-semibold">Cargando...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h2 className="text-xl font-semibold">
          Debes iniciar sesión para acceder al Dashboard
        </h2>
        <Button onClick={() => router.push("/auth")}>Iniciar Sesión</Button>
      </div>
    );
  }

  const handleSidebarSelection = (section: string) => {
    setSelectedSection(section);
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return <DashboardComponent onSelect={handleSidebarSelection} />;
      case "Cursos":
        return <CoursesComponent />;
      case "Progreso":
        return <ProgressComponent />;
      case "Configuración":
        return <SettingComponent />;
        case "Calendario":
            return <div>
                CALENDARIO
            </div>;
      default:
        return <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>;
    }
  };

  return (
    <div>
      <SidebarProvider>
        <AppSidebar onSelect={handleSidebarSelection}/>
        <main className="flex flex-col">
          <SidebarTrigger />
          <div className="pl-10">
          <BlurFade delay={0.5} inView>
            {renderContent()}
          </BlurFade>
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
