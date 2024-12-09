"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/auth/AuthStore";
import { Button } from "@/components/ui/button";
import DashboardComponent from "@/components/shared/dashboard/dashboardComponent";
import BlurFade from "@/components/ui/blur-fade";

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

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
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen flex-col">
        <span className="loading loading-ring loading-lg"></span>
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



  return (
    <div>
        <main className="flex flex-col">
          <div className="pt-6">
          <BlurFade delay={0.5} inView>
            <DashboardComponent/>
          </BlurFade>
          </div>
        </main>
    </div>
  );
}
