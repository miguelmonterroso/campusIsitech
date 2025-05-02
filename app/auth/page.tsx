import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern"
import LoginForm from "@/components/shared/auth/loginForm"
// import RegisterForm from "@/components/shared/auth/registerForm"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Image from "next/image"

export default function authPage(){
    return(
        <div className="flex flex-col lg:flex-row rounded-xl h-screen">
        <div className="lg:w-1/2 p-10 flex flex-col items-center justify-center relative">
        <Image src="/isitech.png" width={150} height={150} alt="isitechLogo"/>
        <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-5%] xl:inset-y-[-20%] skew-y-0 lg:skew-y-12",
        )}
      />        </div>
        <div className="lg:w-1/2 p-10 flex items-center justify-center ">
          <Tabs defaultValue="login" className="w-[400px] min-h-[400px] flex flex-col">
            <TabsList>
              {/* <TabsTrigger value="register">Registrarse</TabsTrigger> */}
              <TabsTrigger value="login">Ingresar</TabsTrigger>
            </TabsList>
            {/* <TabsContent value="register">
                <RegisterForm/>
            </TabsContent> */}
            <TabsContent value="login">
                <LoginForm/>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
}