import { Button } from "@/components/ui/button";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  title: string;
  selected: boolean;
  action: () => void;
}

export default function MuscleButton({ action, selected, title }: ButtonProps) {
  return (
    <Button
      variant="outline"
      className={twMerge(
        "border border-gray100 p-3 rounded-lg justify-center items-center",
        selected ? "border-green500 bg-gray500 border-[3px]" : null
      )}
      onClick={action}
    >
      <span className="font-medium text-base w-24">{title}</span>
    </Button>
  );
}
