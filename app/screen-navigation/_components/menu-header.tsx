"use client";
import { useContext } from "react";
import Header from "@/components/ui/header";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import DefaultAvatar from "@/assets/no-perfil.jpg";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Auth } from "@/hooks/auth";

export default function MenuHeader() {
  const { me, signOut } = useContext(Auth);

  return (
    <Header>
      <div className="flex gap-3 items-center">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={me.avatar ? me.avatar : "https://github.com/shadcn.png"}
          />
        </Avatar>
        <div>
          <p className="font-medium">Olá, </p>
          <h1 className="font-bold text-base">{me.name}</h1>
        </div>
      </div>
      <Button
        size="icon"
        variant="outline"
        onClick={() => signOut()}
        className="border-none"
      >
        <LogOut size={30} />
      </Button>
    </Header>
  );
}
