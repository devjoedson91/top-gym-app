"use client";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import MenuHeader from "./_components/menu-header";
import MuscleButton from "./_components/muscle-button";
import { api } from "@/services/apiClient";
import { useToast } from "@/components/ui/use-toast";
import { CategoriesProps, ExerciseDetailProps } from "@/types";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import ExerciseButton from "./_components/exercise-button";

export default function Dashboard() {
  const { toast } = useToast();

  const [muscleSelected, setMuscleSelected] = useState<CategoriesProps>();

  const [exercises, setExercises] = useState<ExerciseDetailProps[]>([]);

  const [loading, setLoading] = useState(false);

  const { data: categories, isLoading } = useQuery("categories", () => {
    return api
      .get("/categories")
      .then((response) => {
        setMuscleSelected(response.data[0]);

        return response.data as CategoriesProps[];
      })
      .catch(() => {
        toast({
          description: "Falha ao carregar categorias de treino",
          variant: "destructive",
        });
      });
  });

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
    } catch (err) {
      console.log("erro na requisição de exercicios: ", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    listExercises();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [muscleSelected]);

  function handleChangeCategory(item: CategoriesProps) {
    setMuscleSelected(item);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <MenuHeader />
      <div className="flex flex-col gap-7 px-4 my-6">
        <div className="flex w-full gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {categories?.map((item) => {
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
        ) : (
          exercises.map((item) => {
            return <ExerciseButton key={item.id} item={item} />;
          })
        )}
      </div>
    </div>
  );
}
