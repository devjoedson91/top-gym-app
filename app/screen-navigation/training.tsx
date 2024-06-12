import { useContext, useEffect, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import TrainingHeader from "./_components/training-header";
import { TrainingsProps } from "@/types";
import Loading from "@/components/ui/loading";
import { Person, Repeat, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dumbbell, Timer } from "lucide-react";
import colors from "tailwindcss/colors";
import { setupAPIClient } from "@/services/api";
import { Auth } from "@/hooks/auth";
import { useToast } from "@/components/ui/use-toast";
import { twMerge } from "tailwind-merge";
import Link from "next/link";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function Training() {
  const { me } = useContext(Auth);

  const { toast } = useToast();

  const [day, setDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<TrainingsProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  function handleToggleWeekDay(weekDayIndex: number) {
    setDay(weekDayIndex);
  }

  const weekDay = useMemo(() => {
    switch (day) {
      case 0:
        return "Domingo";
      case 1:
        return "Segunda";
      case 2:
        return "Terça";
      case 3:
        return "Quarta";
      case 4:
        return "Quinta";
      case 5:
        return "Sexta";
      case 6:
        return "Sábado";
    }
  }, [day]);

  async function loadTrainings() {
    try {
      setLoading(true);

      const apiClient = setupAPIClient();

      const response = await apiClient.get("/user/trainings", {
        params: {
          user_id: me.id,
        },
      });

      const filterTraining = response.data.filter(
        (training: TrainingsProps) => {
          return training.day_week === day;
        }
      );

      const keys = filterTraining.map((key: TrainingsProps) => {
        return key.muscle;
      });

      setCategories(Array.from(new Set(keys)));

      setTrainings(filterTraining);
    } catch (error: any) {
      switch (error.response.status) {
        case 400:
          toast({
            description:
              "Instabilidade na conexão com a base dados, contate o suporte",
            variant: "destructive",
          });
          break;
        case 500:
          toast({
            description: "Instabilidade no servidor, contate o suporte",
            variant: "destructive",
          });
          break;
        default:
          toast({
            description: "Não foi possível carregar treinos, contate o suporte",
            variant: "destructive",
          });
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrainings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day]);

  async function handlePutAsCompleted(id: string) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.patch(`/training?training_id=${id}`);
      loadTrainings();
    } catch (err) {
      toast({
        description:
          "erro ao completar ou descompletar treino, contate o suporte",
        variant: "destructive",
      });
    }
  }

  async function handlePutAsDeleted(id: string) {
    try {
      const apiClient = setupAPIClient();

      await apiClient.delete("/training", {
        params: {
          training_id: id,
        },
      });

      loadTrainings();
    } catch (err) {
      toast({
        description: "erro ao remover treino, contate o suporte",
        variant: "destructive",
      });
    }
  }

  return (
    <>
      <TrainingHeader refreshPage={() => loadTrainings()} />
      <div className="flex justify-around p-5">
        {weekDays.map((weekDay, i) => (
          <div key={i} className="flex flex-col gap-">
            <h1 className="text-gray200 text-xl font-bold text-center mb-2">
              {weekDay}
            </h1>
            <Checkbox
              className={`${day === i && "bg-green500"}`}
              onCheckedChange={() => handleToggleWeekDay(i)}
              checked={day === i}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex h-96 w-full items-center justify-center">
          <Loading description="Buscando treinos..." />
        </div>
      ) : !categories.length ? (
        <div className="flex h-96 w-full items-center justify-center">
          <h1 className="uppercase">{`você não tem treino para ${weekDay}.`}</h1>
        </div>
      ) : (
        <>
          {categories.map((category, i) => (
            <div className="mb-3 p-5" key={`${i}-${category}`}>
              <div className="flex gap-2 items-center mb-3">
                <h1 className="font-medium text-base">{category}</h1>
                <Person size={25} color="#C4C4CC" />
              </div>
              {trainings.map(
                (training, i) =>
                  training.muscle === category && (
                    <div
                      key={training.id}
                      className="bg-gray500 mb-3 h-auto w-full p-3 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-3 px-1">
                        <Link href={training.video}>
                          <h1 className="font-medium text-lg text-start">
                            {training.exercise}
                          </h1>
                          <div className="flex gap-3 items-center">
                            <Dumbbell size={32} color="#00B37E" />
                            <h1 className="font-medium">{`${training.amount_series} séries`}</h1>
                            <Repeat size={32} color="#00B37E" />
                            <h1 className="font-medium">{`${training.amount_repeat} rept`}</h1>
                          </div>
                        </Link>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handlePutAsCompleted(training.id)}
                          >
                            <Checkbox
                              checked={training.is_completed}
                              className={`${
                                training.is_completed && "bg-green500"
                              }`}
                            />
                          </button>
                          <p className="font-medium text-base">
                            Marcar como concluído
                          </p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        onClick={() => handlePutAsDeleted(training.id)}
                      >
                        <Trash size={38} color={colors.red["500"]} />
                      </Button>
                    </div>
                  )
              )}

              {/* <Button
                className={twMerge(
                  "bg-green700 mt-6 flex gap-3 font-medium items-center w-40 text-white"
                )}
              >
                <Timer size={25} />
                <h1 className="text-base">Iniciar treino</h1>
              </Button> */}
            </div>
          ))}
        </>
      )}
    </>
  );
}
