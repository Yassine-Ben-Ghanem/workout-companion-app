import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class SaveWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(workout: Workout): Promise<void> {
    return this.workoutRepository.saveWorkout(workout);
  }
}
