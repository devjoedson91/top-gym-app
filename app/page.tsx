"use client";
import { useContext, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Auth } from "@/hooks/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Barbell } from "@phosphor-icons/react";

const formSchema = z.object({
  email: z.string().email({ message: "Informe um email válido" }),
  password: z
    .string()
    .min(4, { message: "A senha deve ter no mínimo de 4 caracteres" }),
});

export default function Home() {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  const { signIn, loadingAuth } = useContext(Auth);

  const [passwordIsVisible, setPasswordIsVisible] = useState(false);

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    await signIn(data);
  }

  return (
    <div className="flex relative h-screen items-center justify-center bg-signIn bg-center bg-cover bg-no-repeat">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col items-center gap-8 z-[1]"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <Barbell size={65} color="#00B37E" />
            <h1 className="font-bold text-3xl">Top Gym</h1>
            <p className="font-medium text-base">
              Treine sua mente e seu corpo
            </p>
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="E-mail"
                    className="h-12 w-80 text-default text-base font-semibold"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="relative">
                  <FormControl>
                    <Input
                      placeholder="Senha"
                      className="h-12 w-80 text-base text-default font-semibold"
                      type={passwordIsVisible ? "text" : "password"}
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute flex items-center w-10 h-10 justify-center right-1 top-1  bg-white"
                    onClick={() => setPasswordIsVisible(!passwordIsVisible)}
                  >
                    {passwordIsVisible ? (
                      <Eye size={18} color="#000" />
                    ) : (
                      <EyeOff size={18} color="#000" />
                    )}
                  </button>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-green700 border-none hover:bg-green700/60 h-12 uppercase tracking-widest w-80 rounded-md text-sm"
            variant="outline"
            disabled={loadingAuth}
          >
            Acessar
          </Button>
        </form>
      </Form>
      <div className="absolute left-0 bottom-0 right-0 bg-transparent h-[55%] bg-gradient-to-t from-black/95 to-black/5" />
    </div>
  );
}
