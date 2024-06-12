import { ChangeEvent, useContext, useState } from "react";
import Image from "next/image";
import DefaultProfile from "@/assets/no-perfil.jpg";
import { Auth } from "@/hooks/auth";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

type FormData = {
  name: string;
  password?: string;
  password_confirm?: string;
};
interface AvatarProps {
  name: string;
  type: string | null;
  uri: string;
}

const Schema = z
  .object({
    name: z.string({ message: "Informe o nome" }),
    password: z
      .string({ message: "Informe a senha" })
      .min(4, { message: "A senha deve ter no mínimo de 4 caracteres" }),
    password_confirm: z.string({ message: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "As senhas devem ser iguais",
    path: ["password_confirm"],
  });

export default function Profile() {
  const { me } = useContext(Auth);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  const [imageAvatar, setImageAvatar] = useState({});

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const image = event.target.files[0];

    if (!image) return;

    if (
      image.type === "image/jpeg" ||
      image.type === "image/jpg" ||
      image.type === "image/png"
    ) {
      setAvatarUrl(URL.createObjectURL(event.target.files[0]));
      setImageAvatar(image);
    }
  }

  function handleUserUpdate(data: z.infer<typeof Schema>) {
    console.log(data);
  }

  return (
    <>
      <div className="bg-secondary h-[100px] w-full flex items-center justify-center px-4">
        <h1 className="font-medium text-lg">Perfil</h1>
      </div>
      <div className="flex flex-col items-center gap-5 p-4">
        <div className="relative flex flex-col items-center gap-2">
          <Label className="flex size-28 items-center justify-center rounded-full">
            <Upload
              size={30}
              color="#868C94"
              className="absolute z-[99] duration-700"
            />
            <Input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFile}
              className="hidden"
            />
            {me.avatar ? (
              <Image
                src={me.avatar}
                alt={me.name}
                width={112}
                height={112}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Image
                src={avatarUrl || DefaultProfile.src}
                alt="Foto de usuário"
                width={112}
                height={112}
                className="w-full h-full rounded-full object-cover"
              />
            )}
          </Label>
          <button>
            <h1 className="text-green500 text-base">Alterar foto</h1>
          </button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUserUpdate)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Nome"
                      className="w-80 bg-gray500 text-base rounded-md"
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
                  <FormControl>
                    <Input
                      placeholder="Senha"
                      className="w-80 bg-gray500 text-base rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password_confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Confirme a senha"
                      className="w-80 bg-gray500 text-base rounded-md"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-80 bg-green700">
              <h1 className="text-lg font-medium">Atualizar</h1>
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
