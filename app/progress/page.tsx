import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProgressPage(){
    return(
        <div className="flex flex-col gap-8 items-center justify-center h-screen text-3xl">
            ESTAMOS TRABAJANDO...
            
            <Link href="/dashboard">
                <Button>
                    Ir al Dashboard.
                </Button>
            </Link>
        </div>
    )
}