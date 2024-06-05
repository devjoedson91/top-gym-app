export interface CategoriesProps {
  id: string;
  muscle: string;
}

export interface ExercisesProps {
  id: string;
  name: string;
  cover: string;
  video: string;
  category_id: string | undefined;
}

export interface TrainingsProps {
  id: string;
  muscle: string;
  exercise: string;
  video: string;
  amount_series: number;
  amount_repeat: number;
  is_completed: boolean;
  day_week: number;
}

export interface ExerciseDetailProps {
  id: string;
  name: string;
  cover: string;
  video: string;
  categories: {
    muscle: string;
  };
}
