import { Workout } from '../entities/Workout';

export interface WorkoutRepository {
  getWorkouts(): Promise<Workout[]>;
  getWorkoutById(id: string): Promise<Workout | null>;
  saveWorkout(workout: Workout): Promise<void>;
  deleteWorkout(id: string): Promise<void>;
  completeWorkout(id: string, completedDate: string): Promise<Workout>;
  getWorkoutsForDate(date: string): Promise<Workout[]>;
}
