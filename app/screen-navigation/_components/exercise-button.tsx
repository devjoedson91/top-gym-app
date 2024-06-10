import { Button } from "@/components/ui/button";
import { ExerciseDetailProps } from "@/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ExerciseButtonProps {
  item: ExerciseDetailProps;
}

export default function ExerciseButton({ item }: ExerciseButtonProps) {
  const router = useRouter();

  function handleSelectExercise() {
    const query = encodeURIComponent(JSON.stringify(item));

    router.push(`/details?item=${query}`);
  }

  return (
    <Button
      variant="outline"
      className="bg-gray500 w-full h-28 p-2 border-none rounded-lg flex items-center justify-between"
      onClick={handleSelectExercise}
    >
      {item.cover ? (
        <Image
          src={item.cover}
          alt="Cover"
          width={120}
          height={80}
          className="w-[120px] h-full rounded-lg object-cover"
        />
      ) : (
        <div className="w-[120px] h-full rounded-lg bg-gray300" />
      )}
      <div className="w-[150px] flex items-center justify-center">
        <h1 className="font-medium text-base whitespace-normal">{item.name}</h1>
      </div>
      <ChevronRight size={32} color="#fff" />
    </Button>
  );
}
