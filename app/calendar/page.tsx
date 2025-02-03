import CustomCalendar from "@/components/calendar/calendar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CalendarPage(){
    return(
        <div className="flex flex-col gap-8 items-center justify-center h-screen text-3xl">
            ESTAMOS TRABAJANDO...

            <CustomCalendar/>
            
            <Link href="/dashboard">
                <Button>
                    Ir al Dashboard.
                </Button>
            </Link>
        </div>
    )
}