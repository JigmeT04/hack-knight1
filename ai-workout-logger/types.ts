export interface Workout {
  id: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface RecommendedExercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export interface WorkoutRecommendation {
  sessionTitle: string;
  commentary: string;
  exercises: RecommendedExercise[];
}

export type Goal = 'Strength' | 'Size' | 'Endurance';

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: Gender;
}
