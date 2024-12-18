import { Button } from "@/components/ui/button";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";

interface TrainingHeaderProps {
  refreshPage: () => void;
}

export default function TrainingHeader({ refreshPage }: TrainingHeaderProps) {
  return (
    <header className="flex items-center relative justify-center px-5 bg-secondary h-[100px]">
      <h1 className="font-medium text-lg">Ficha semanal</h1>
      <Button size="icon" className="absolute left-6" onClick={refreshPage}>
        <ArrowsCounterClockwise size={30} color="#00B37E" />
      </Button>
    </header>
  );
}
