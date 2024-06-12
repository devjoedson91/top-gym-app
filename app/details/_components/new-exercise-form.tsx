"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlignCenterHorizontal } from "@phosphor-icons/react";
import { Dumbbell, Repeat } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { setupAPIClient } from "@/services/api";
import { Auth } from "@/hooks/auth";

const weekDays = ["D", "S", "T", "Q", "Q", "S", "S"];
interface FormProps {
  exercise_id: string;
  user_id: string;
}

const FormSchema = z.object({
  amount_series: z
    .string({ message: "Informe a quantidade de séries" })
    .min(1, { message: "A quantidade de séries deve ser no mínimo 1" }),
  amount_repeat: z
    .string({ message: "Informe a quantidade de repetições" })
    .min(1, { message: "A quantidade de repetições deve ser no mínimo 1" }),
  load: z.string().optional(),
});

export default function NewExerciseForm({ exercise_id, user_id }: FormProps) {
  const { toast } = useToast();

  const { signOut } = useContext(Auth);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [days, setDays] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  function handleToggleWeekDay(weekDayIndex: number) {
    if (days.includes(weekDayIndex)) {
      setDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setDays((prevState) => [...prevState, weekDayIndex]);
    }
  }

  function handleExerciseRegister(data: z.infer<typeof FormSchema>) {
    if (!days.length) {
      toast({
        description:
          "Para concluir, você deve selecionar ao menos um dia da semana.",
        variant: "destructive",
      });

      return;
    }

    setLoading(true);

    const apiClient = setupAPIClient();

    days.map(async (day: number) => {
      await apiClient
        .post("/training", {
          exercise_id,
          user_id,
          amount_series: Number(data.amount_series),
          amount_repeat: Number(data.amount_repeat),
          load: Number(data.load) ?? 0,
          day_week: day,
        })
        .then((response) => {
          toast({
            description: "Exercício adicionado com sucesso!",
            variant: "success",
          });
        })
        .catch((error: any) => {
          if (error.response.status === 401) {
            toast({
              description: "Sessão Expirada!",
              variant: "destructive",
            });

            signOut();

            return;
          }

          toast({
            description: error.response?.data.error,
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    });
  }

  return (
    <div>
      <div className="flex justify-around my-4">
        {weekDays.map((weekDay, i) => {
          return (
            <div key={i} className="flex flex-col items-center">
              <h1 className="text-gray200 text-xl font-bold text-center mx-1 mb-2">
                {weekDay}
              </h1>
              <Checkbox
                className={`${days.includes(i) && "bg-green500"}`}
                onCheckedChange={() => handleToggleWeekDay(i)}
                checked={days.includes(i)}
              />
            </div>
          );
        })}
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleExerciseRegister)}
          className="flex flex-col gap-5 px-3"
        >
          <FormField
            control={form.control}
            name="amount_series"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <Dumbbell size={32} color="#00875F" />
                <FormLabel className="font-medium text-gray200 text-base">
                  Séries
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    className="w-14 bg-gray500 text-base rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount_repeat"
            render={({ field }) => (
              <FormItem className="flex items-center gap-4">
                <Repeat size={32} color="#00875F" />
                <FormLabel className="font-medium text-gray200 text-base">
                  Repetições
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    className="w-14 bg-gray500 text-base rounded-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="load"
            render={({ field }) => (
              <FormItem className="flex flex-wrap items-center gap-4">
                <AlignCenterHorizontal size={32} color="#00875F" />
                <FormLabel className="font-medium text-gray200 text-base">
                  Carga
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="0"
                    className="w-14 bg-gray500 text-base rounded-md"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="rounded-md bg-green700 w-full text-base font-medium"
            disabled={loading}
          >
            Adicionar exercício
          </Button>
        </form>
      </Form>
    </div>
  );
}
