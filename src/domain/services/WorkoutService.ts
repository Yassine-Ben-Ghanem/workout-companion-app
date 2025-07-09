import { Workout } from '../entities/Workout';
import { GetWorkoutsUseCase } from '../usecases/workout/GetWorkoutsUseCase';
import { GetWorkoutByIdUseCase } from '../usecases/workout/GetWorkoutByIdUseCase';
import { SaveWorkoutUseCase } from '../usecases/workout/SaveWorkoutUseCase';
import { DeleteWorkoutUseCase } from '../usecases/workout/DeleteWorkoutUseCase';
import { CompleteWorkoutUseCase } from '../usecases/workout/CompleteWorkoutUseCase';
import { GetWorkoutsForDateUseCase } from '../usecases/workout/GetWorkoutsForDateUseCase';

export class WorkoutService {
  constructor(
    private getWorkoutsUseCase: GetWorkoutsUseCase,
    private getWorkoutByIdUseCase: GetWorkoutByIdUseCase,
    private saveWorkoutUseCase: SaveWorkoutUseCase,
    private deleteWorkoutUseCase: DeleteWorkoutUseCase,
    private completeWorkoutUseCase: CompleteWorkoutUseCase,
    private getWorkoutsForDateUseCase: GetWorkoutsForDateUseCase,
  ) {}

  async getAllWorkouts(): Promise<Workout[]> {
    return this.getWorkoutsUseCase.execute();
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    return this.getWorkoutByIdUseCase.execute(id);
  }

  async saveWorkout(workout: Workout): Promise<void> {
    return this.saveWorkoutUseCase.execute(workout);
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.deleteWorkoutUseCase.execute(id);
  }

  async completeWorkout(id: string, completedDate: string): Promise<Workout> {
    return this.completeWorkoutUseCase.execute(id, completedDate);
  }

  async getWorkoutsForDate(date: string): Promise<Workout[]> {
    return this.getWorkoutsForDateUseCase.execute(date);
  }
}
