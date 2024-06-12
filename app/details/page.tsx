"use client";
import { useContext } from "react";
import DetailsHeader from "./_components/details-header";
import { ExerciseDetailProps } from "@/types";
import { Play } from "@phosphor-icons/react";
import Image from "next/image";
import NewExerciseForm from "./_components/new-exercise-form";
import { Auth } from "@/hooks/auth";
import Loading from "@/components/ui/loading";
import Link from "next/link";

interface DetailsProps {
  searchParams: { item: string };
}

export default function Details({ searchParams }: DetailsProps) {
  const { me } = useContext(Auth);

  const exercise: ExerciseDetailProps = JSON.parse(searchParams.item);

  if (!exercise) {
    return (
      <div className="flex items-center h-screen justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <DetailsHeader
        exercise={exercise.name}
        muscleGroup={exercise.categories.muscle}
      />
      <div className="p-5">
        <Link href={exercise.video}>
          <div className="relative w-full h-48">
            <div className="absolute inset-0 z-[1] hover:bg-black/30 transition duration-300 flex items-center justify-center">
              <Play size={40} color="#FAFAFA" />
            </div>
            <Image
              src={exercise.cover}
              alt={exercise.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        </Link>
        <NewExerciseForm exercise_id={exercise.id} user_id={me.id} />
      </div>
    </div>
  );
}
