"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
// import { useState } from "react";
import useAuthStore from "@/store/auth/AuthStore";

export default function SettingsPage() {
  const { user } = useAuthStore();
//   const [name, setName] = useState(user?.name || "");
//   const [bio, setBio] = useState(user?.bio || "");
//   const [darkMode, setDarkMode] = useState(false);
//   const [email, setEmail] = useState(user?.email || "");

  return (
    <div className="flex flex-col gap-8 items-center justify-center min-h-screen text-xl">
      <Card className="w-[90%] max-w-4xl p-6">
        {/* Avatar y Nombre */}
        <CardHeader className="flex flex-row gap-10 items-center">
          <div className="relative">
            <Avatar className="w-[150px] h-[150px]">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>MM</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            >
              Cambiar Foto
            </Button>
          </div>
          <div>
            <CardTitle>
              <Input 
                className="text-2xl font-semibold"
                disabled
                value={user?.name}
                // onChange={(e) => setName(e.target.value)}
              />
            </CardTitle>
            <CardDescription>Nombre de usuario</CardDescription>
          </div>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input value={user?.email} disabled className="max-w-[300px]" />
          </div>

          {/* Biografía */}
          <div className="md:col-span-2">
            <Label>Biografía</Label>
            <Textarea
              placeholder="Escribe algo sobre ti..."
            //   value={bio}
            //   onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Preferencias */}
          <div className="flex items-center justify-between md:col-span-2">
            <Label>Modo Oscuro</Label>
            <Switch checked
            //  onCheckedChange={setDarkMode} 
             />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button className="bg-white text-black">Cambiar contraseña</Button>
          <Button>Guardar Cambios</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
