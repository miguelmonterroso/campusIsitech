import BlurFade from "@/components/ui/blur-fade";

export default function SettingComponent(){
    return(
        <BlurFade delay={0.5} inView>
            <div className="text-2xl font-bold">
                SETTINGS
            </div>
        </BlurFade>
    )
}