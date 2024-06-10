import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import TrainingHeader from "./_components/training-header";
import { TrainingsProps } from "@/types";
import Loading from "@/components/ui/loading";
import { Person, Repeat, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";
import colors from "tailwindcss/colors";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function Training() {
  const [days, setDays] = useState<number[]>([1]);
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState<TrainingsProps[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  function handleToggleWeekDay(weekDayIndex: number) {
    setDays((prevState) => [weekDayIndex]);
  }

  return (
    <>
      <TrainingHeader />
      <div className="flex justify-around mt-6 mb-3">
        {weekDays.map((weekDay, i) => (
          <div key={i} className="flex flex-col gap-">
            <h1 className="text-gray200 text-xl font-bold text-center mb-2">
              {weekDay}
            </h1>
            <Checkbox
              className={`${days.includes(i) && "bg-green500"}`}
              onCheckedChange={() => handleToggleWeekDay(i)}
              checked={days.includes(i)}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <Loading />
      ) : !categories.length ? (
        <div className="flex h-96 w-full items-center justify-center">
          <h1>Você não tem treino para esse dia</h1>
        </div>
      ) : (
        <>
          {categories.map((category, i) => (
            <div className="mb-3" key={`${i}-${category}`}>
              <div className="flex gap-2">
                <h1 className="font-medium text-base mb-3">{category}</h1>
                <Person size={20} color="#C4C4CC" />
              </div>
              {trainings.map(
                (training, i) =>
                  training.muscle === category && (
                    <Button
                      key={training.id}
                      className="bg-gray500 mb-3 w-full p-3 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <h1 className="font-medium text-lg mb-3">
                          {training.exercise}
                        </h1>
                        <div className="flex gap-3 items-center mb-3">
                          <Dumbbell size={32} color="#00875f" />
                          <h1 className="font-medium">{`${training.amount_series} séries`}</h1>
                          <Repeat size={32} color="#00875f" />
                          <h1 className="font-medium">{`${training.amount_repeat} rept`}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                          <Checkbox checked={training.is_completed} />
                          <p className="font-medium text-base">
                            Marcar como concluído
                          </p>
                        </div>
                      </div>
                      <Button>
                        <Trash size={38} color={colors.red["500"]} />
                      </Button>
                    </Button>
                  )
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
