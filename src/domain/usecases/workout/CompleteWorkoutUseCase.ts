import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class CompleteWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(id: string, completedDate: string): Promise<Workout> {
    return this.workoutRepository.completeWorkout(id, completedDate);
  }
}
