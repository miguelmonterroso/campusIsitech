import BlurFade from "@/components/ui/blur-fade";

export default function ProgressComponent(){
    return(
        <BlurFade delay={0.5} inView>
            <div className="text-2xl font-bold">
                PROGRESS
            </div>
        </BlurFade>

    )
}