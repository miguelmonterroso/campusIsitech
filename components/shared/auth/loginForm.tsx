"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import useAuthStore from "@/store/auth/AuthStore"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react" 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const FormSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres.",
  }),
})

export default function LoginForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { loginWithTestUser } = useAuthStore()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { email, password } = data
    loginWithTestUser(email, password)

    if (useAuthStore.getState().isAuthenticated) {
      toast({
        title: "Inicio de sesión exitoso",
        description: "Redirigiendo al dashboard...",
        duration: 1400
      })
      router.push("/dashboard")
    } else {
      toast({
        title: "Error",
        description: "Correo o contraseña incorrectos. Usa: email: test@example.com, contraseña: password",
        variant: "destructive",
        duration: 1400
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        {/* Campo de Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="ejemplo@correo.com" {...field} />
              </FormControl>
              <FormDescription>
                Ingresa el correo con el que te registraste.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Campo de Contraseña */}
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
              <FormDescription>
                Ingresa tu contraseña.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Botón de Enviar */}
        <Button type="submit">Iniciar Sesión</Button>
      </form>
    </Form>
  )
}
