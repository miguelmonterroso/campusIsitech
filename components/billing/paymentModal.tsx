import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Banknote, CreditCard } from "lucide-react";
import CardForm from "./paymentMethodsForms/cardModal";
import BlurFade from "../ui/blur-fade";

export default function PaymentModal() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-isiBlue text-white font-semibold hover:bg-blue-600 mt-3">
          Pagar factura <Banknote />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <BlurFade inView delay={0.3}>
          <DialogHeader>
            <DialogTitle>Método de pago</DialogTitle>
            <DialogDescription>
              Agregua un método de pago a tu cuenta.
              <div className="flex justify-center mt-5">
                <Tabs defaultValue="creditCard" className="mt-5">
                  <TabsList>
                    <TabsTrigger value="creditCard">
                      <div className="w-[110px] h-[70px] flex items-center justify-center border border-white flex-col font-semibold rounded-md">
                        <CreditCard />
                        Tarjeta
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="bankTransfer">
                      <div className="w-[110px] h-[70px] flex items-center justify-center border border-white flex-col font-semibold rounded-md">
                        <Banknote />
                        Transferencia
                      </div>
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent className="mt-10" value="creditCard">
                    <BlurFade inView delay={0.6}>
                      <CardForm />
                    </BlurFade>
                  </TabsContent>
                  <TabsContent className="mt-10" value="bankTransfer">
                    Bank
                  </TabsContent>
                </Tabs>
              </div>
            </DialogDescription>
          </DialogHeader>
        </BlurFade>
      </DialogContent>
    </Dialog>
  );
}
