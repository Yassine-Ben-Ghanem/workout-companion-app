import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class GetWorkoutsForDateUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(date: string): Promise<Workout[]> {
    return this.workoutRepository.getWorkoutsForDate(date);
  }
}
