"use client";
import Header from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Person } from "@phosphor-icons/react";

interface DetailsProps {
  exercise: string;
  muscleGroup: string;
}

export default function DetailsHeader({ exercise, muscleGroup }: DetailsProps) {
  const router = useRouter();

  function handleBackToHome() {
    router.back();
  }

  return (
    <Header>
      <Button
        size="icon"
        variant="outline"
        onClick={handleBackToHome}
        className="border-none"
      >
        <ChevronLeft size={30} />
      </Button>
      <h1 className="font-medium text-lg">
        {exercise ? exercise : "Detalhes do exercício"}
      </h1>
      <div className="flex items-center gap-1">
        <Person size={20} color="#C4C4CC" />
        <h2 className="font-medium text-base">{muscleGroup}</h2>
      </div>
    </Header>
  );
}
