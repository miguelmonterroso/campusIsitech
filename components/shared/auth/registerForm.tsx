"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BlurFade from "@/components/ui/blur-fade";

const RegisterSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres."),
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
  confirmPassword: z
    .string()
    .min(6, "La confirmación de la contraseña debe tener al menos 6 caracteres."),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function onSubmit(data: z.infer<typeof RegisterSchema>) {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
  
      if (response.ok) {
        toast({
          title: "Registro exitoso",
          description: "Redirigiendo al inicio de sesión...",
        });
        router.push("/auth");
      } else {
        const errorResponse = await response.json();
  
        if (errorResponse.errors) {
          const errorMessages = errorResponse.errors
            .map((err: { message: string }) => err.message)
            .join("\n");
  
          toast({
            title: "Error en el registro",
            description: errorMessages,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: errorResponse.message || "Ocurrió un error desconocido.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error en el registro:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      });
    }
  }
  

  return (
    <BlurFade inView={true} delay={0.5}>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre completo" {...field} />
              </FormControl>
              <FormDescription>Ingresa tu nombre completo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@correo.com" {...field} />
              </FormControl>
              <FormDescription>Ingresa un correo válido.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <FormDescription>Crea una contraseña segura.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <FormControl>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormDescription>Confirma tu contraseña.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Registrarse</Button>
      </form>
    </Form>
    </BlurFade>
  );
}
