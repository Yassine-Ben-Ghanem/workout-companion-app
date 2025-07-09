import { Workout } from '../../entities/Workout';
import { WorkoutRepository } from '../../repositories/WorkoutRepository';

export class GetWorkoutByIdUseCase {
  constructor(private workoutRepository: WorkoutRepository) {}

  async execute(id: string): Promise<Workout | null> {
    return this.workoutRepository.getWorkoutById(id);
  }
}
