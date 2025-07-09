import { WorkoutRepositoryImpl } from '../../data/repositories/WorkoutRepositoryImpl';
import { GetWorkoutsUseCase } from '../usecases/workout/GetWorkoutsUseCase';
import { GetWorkoutByIdUseCase } from '../usecases/workout/GetWorkoutByIdUseCase';
import { SaveWorkoutUseCase } from '../usecases/workout/SaveWorkoutUseCase';
import { DeleteWorkoutUseCase } from '../usecases/workout/DeleteWorkoutUseCase';
import { CompleteWorkoutUseCase } from '../usecases/workout/CompleteWorkoutUseCase';
import { GetWorkoutsForDateUseCase } from '../usecases/workout/GetWorkoutsForDateUseCase';
import { WorkoutService } from '../services/WorkoutService';

// Create repository instance
const workoutRepository = new WorkoutRepositoryImpl();

// Create use case instances
export const getWorkoutsUseCase = new GetWorkoutsUseCase(workoutRepository);
export const getWorkoutByIdUseCase = new GetWorkoutByIdUseCase(
  workoutRepository,
);
export const saveWorkoutUseCase = new SaveWorkoutUseCase(workoutRepository);
export const deleteWorkoutUseCase = new DeleteWorkoutUseCase(workoutRepository);
export const completeWorkoutUseCase = new CompleteWorkoutUseCase(
  workoutRepository,
);
export const getWorkoutsForDateUseCase = new GetWorkoutsForDateUseCase(
  workoutRepository,
);

// Create and export WorkoutService instance
export const workoutService = new WorkoutService(
  getWorkoutsUseCase,
  getWorkoutByIdUseCase,
  saveWorkoutUseCase,
  deleteWorkoutUseCase,
  completeWorkoutUseCase,
  getWorkoutsForDateUseCase,
);
