import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCardIcon } from "lucide-react";

const formSchema = z.object({
  cardName: z.string().min(2).max(30),
  cardNumber: z.string().min(2).max(20),
  cvv: z.string().min(1).max(3),
  expMonth: z.string({
    required_error: "Por favor selecciona un mes.",
  }),
  expYear: z.string({
    required_error: "Por favor selecciona un año.",
  }),
});

export default function CardForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      cvv: "",
      expMonth: "",
      expYear: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cardName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-semibold">
                Nombre en la tarjeta
              </FormLabel>
              <FormControl>
                <Input placeholder="Ejemplo: Jon Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cardNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-semibold">
                Numero de tarjeta
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ejemplo: 2003 2001 2024 1111"
                  {...field}
                  value={field.value
                    ?.replace(/\D/g, "")
                    .replace(/(\d{4})/g, "$1 ")
                    .trim()}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, "");
                    field.onChange(rawValue);
                  }}
                  maxLength={19}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3">
          <FormLabel className="text-white font-semibold">
            Fecha de expiración
          </FormLabel>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="expMonth"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Mes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="01">Enero</SelectItem>
                        <SelectItem value="02">Febrero</SelectItem>
                        <SelectItem value="03">Marzo</SelectItem>
                        <SelectItem value="04">Abril</SelectItem>
                        <SelectItem value="05">Mayo</SelectItem>
                        <SelectItem value="06">Junio</SelectItem>
                        <SelectItem value="07">Julio</SelectItem>
                        <SelectItem value="08">Agosto</SelectItem>
                        <SelectItem value="09">Septiembre</SelectItem>
                        <SelectItem value="10">Octubre</SelectItem>
                        <SelectItem value="11">Noviembre</SelectItem>
                        <SelectItem value="12">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expYear"
              render={({ field }) => (
                <FormItem className="w-1/2">
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Año" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                        <SelectItem value="2027">2027</SelectItem>
                        <SelectItem value="2028">2028</SelectItem>
                        <SelectItem value="2029">2029</SelectItem>
                        <SelectItem value="2030">2030</SelectItem>
                        <SelectItem value="2031">2031</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="cvv"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white font-semibold">CVV</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Numero de seguridad de tu tarjeta
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="font-semibold w-full" type="submit">
          Pagar <CreditCardIcon />
        </Button>
      </form>
    </Form>
  );
}
