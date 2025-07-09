import { GetWorkoutByIdUseCase } from '../../../domain/usecases/workout/GetWorkoutByIdUseCase';
import { WorkoutRepository } from '../../../domain/repositories/WorkoutRepository';
import {
  Workout,
  WorkoutType,
  WorkoutLocation,
} from '../../../domain/entities/Workout';

describe('GetWorkoutByIdUseCase', () => {
  // Mock repository
  const mockWorkoutRepository: jest.Mocked<WorkoutRepository> = {
    getWorkouts: jest.fn(),
    getWorkoutById: jest.fn(),
    saveWorkout: jest.fn(),
    deleteWorkout: jest.fn(),
    completeWorkout: jest.fn(),
    getWorkoutsForDate: jest.fn(),
  };

  // Create the use case with the mock repository
  const getWorkoutByIdUseCase = new GetWorkoutByIdUseCase(
    mockWorkoutRepository,
  );

  // Sample workout data
  const mockWorkout: Workout = {
    id: '1',
    name: 'Morning Cardio',
    date: '2023-10-15',
    type: WorkoutType.CARDIO,
    location: WorkoutLocation.HOME,
    completed: false,
    exercises: [
      {
        id: 'ex1',
        name: 'Running',
        sets: 1,
        reps: 1,
        restTime: 60,
        notes: 'Steady pace',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a workout when found', async () => {
    // Arrange
    mockWorkoutRepository.getWorkoutById.mockResolvedValue(mockWorkout);

    // Act
    const result = await getWorkoutByIdUseCase.execute('1');

    // Assert
    expect(mockWorkoutRepository.getWorkoutById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockWorkout);
  });

  test('should return null when workout not found', async () => {
    // Arrange
    mockWorkoutRepository.getWorkoutById.mockResolvedValue(null);

    // Act
    const result = await getWorkoutByIdUseCase.execute('999');

    // Assert
    expect(mockWorkoutRepository.getWorkoutById).toHaveBeenCalledWith('999');
    expect(result).toBeNull();
  });

  test('should propagate errors from repository', async () => {
    // Arrange
    const error = new Error('Database error');
    mockWorkoutRepository.getWorkoutById.mockRejectedValue(error);

    // Act & Assert
    await expect(getWorkoutByIdUseCase.execute('1')).rejects.toThrow(
      'Database error',
    );
    expect(mockWorkoutRepository.getWorkoutById).toHaveBeenCalledWith('1');
  });
});
