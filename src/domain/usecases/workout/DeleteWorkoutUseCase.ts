import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class DeleteWorkoutUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(id: string): Promise<void> {
    return this.workoutRepository.deleteWorkout(id);
  }
}
