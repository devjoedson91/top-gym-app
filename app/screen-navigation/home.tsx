"use client";
import { useEffect, useState } from "react";
import HomeHeader from "./_components/home-header";
import MuscleButton from "./_components/muscle-button";
import { api } from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { CategoriesProps, ExerciseDetailProps } from "@/types";
import Loading from "@/components/ui/loading";
import ExerciseButton from "./_components/exercise-button";

interface HomeProps {
  categories: CategoriesProps[];
}

export default function Home({ categories }: HomeProps) {
  const { toast } = useToast();

  const [muscleSelected, setMuscleSelected] = useState<CategoriesProps>();

  const [exercises, setExercises] = useState<ExerciseDetailProps[]>([]);

  const [loading, setLoading] = useState(false);

  async function listExercises() {
    try {
      if (muscleSelected?.id) {
        setLoading(true);

        const response = await api.get("/category/exercise", {
          params: {
            category_id: muscleSelected.id,
          },
        });

        setExercises(response.data);

        setLoading(false);
      } else {
        return;
      }
    } catch (error: any) {
      toast({
        description: "Erro ao carregar exercícios",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    categories && setMuscleSelected(categories[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  useEffect(() => {
    muscleSelected && listExercises();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muscleSelected]);

  function handleChangeCategory(item: CategoriesProps) {
    setMuscleSelected(item);
  }

  return (
    <div>
      <HomeHeader />
      <div className="flex flex-col gap-7 px-5 my-6">
        <div className="flex w-full gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {categories.map((item) => {
            return (
              <MuscleButton
                key={item.id}
                action={() => handleChangeCategory(item)}
                title={item.muscle}
                selected={muscleSelected?.id === item.id}
              />
            );
          })}
        </div>
        <h1 className="font-medium text-base">Exercícios</h1>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <Loading />
          </div>
        ) : exercises.length ? (
          exercises.map((item) => {
            return <ExerciseButton key={item.id} item={item} />;
          })
        ) : (
          <h1 className="text-center mt-16">
            Não encontramos exercícios para o grupo muscular selecionado 😐
          </h1>
        )}
      </div>
    </div>
  );
}
