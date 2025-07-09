import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class GetWorkoutsUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(): Promise<Workout[]> {
    return this.workoutRepository.getWorkouts();
  }
}
