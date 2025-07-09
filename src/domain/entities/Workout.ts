export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  restTime?: number; // Rest time in seconds
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // Optional time in HH:MM format
  exercises: Exercise[];
  notes?: string;
  completed: boolean;
  completedDate?: string; // ISO date string when workout was completed
  duration?: number; // Duration in minutes
  calories?: number; // Estimated calories burned
  type: WorkoutType;
  location: WorkoutLocation;
}

export enum WorkoutType {
  STRENGTH = 'STRENGTH',
  CARDIO = 'CARDIO',
  FLEXIBILITY = 'FLEXIBILITY',
  HIIT = 'HIIT',
  CUSTOM = 'CUSTOM',
}

export enum WorkoutLocation {
  HOME = 'HOME',
  GYM = 'GYM',
  OUTDOOR = 'OUTDOOR',
  OTHER = 'OTHER',
}

// Weekly summary type
export interface WeeklySummary {
  startDate: string;
  endDate: string;
  totalWorkouts: number;
  completedWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  workoutsByType: Record<WorkoutType, number>;
  dailySummary: DailySummary[];
}

export interface DailySummary {
  date: string;
  workouts: number;
  completed: number;
  duration: number;
  calories: number;
}
