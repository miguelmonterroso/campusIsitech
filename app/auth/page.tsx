import LoginForm from "@/components/shared/auth/loginForm"
import RegisterForm from "@/components/shared/auth/registerForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function authPage(){
    return(
        <div className="flex flex-col lg:flex-row rounded-xl h-screen">
        <div className="lg:w-1/2 p-10 flex flex-col justify-between relative bg-gradient-to-br from-blue-400 to-purple-700">
        <Image src="/isitech.png" width={100} height={100} alt="isitechLogo"/>
        </div>
        <div className="lg:w-1/2 p-10 flex items-center justify-center">
          <Tabs defaultValue="login" className="w-[400px] min-h-[400px] flex flex-col">
            <TabsList>
              <TabsTrigger value="register">Registrarse</TabsTrigger>
              <TabsTrigger value="login">Ingresar</TabsTrigger>
            </TabsList>
            <TabsContent value="register">
                <RegisterForm/>
            </TabsContent>
            <TabsContent value="login">
                <LoginForm/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
}