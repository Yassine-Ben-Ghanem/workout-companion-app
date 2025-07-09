import { useState, useCallback } from 'react';
import { workoutService } from '../../domain/di/workoutDependencies';
import { Workout } from '../../domain/entities/Workout';

export const useWorkoutService = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWorkouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const workouts = await workoutService.getAllWorkouts();
      setLoading(false);
      return workouts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workouts');
      setLoading(false);
      return [];
    }
  }, []);

  const getWorkoutById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      console.log('useWorkoutService: Fetching workout with ID:', id);
      const workout = await workoutService.getWorkoutById(id);
      console.log('useWorkoutService: Result:', workout);
      setLoading(false);
      return workout;
    } catch (err) {
      console.error('useWorkoutService: Error fetching workout:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch workout');
      setLoading(false);
      return null;
    }
  }, []);

  const saveWorkout = useCallback(async (workout: Workout) => {
    setLoading(true);
    setError(null);
    try {
      await workoutService.saveWorkout(workout);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workout');
      setLoading(false);
      return false;
    }
  }, []);

  const deleteWorkout = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await workoutService.deleteWorkout(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete workout');
      setLoading(false);
      return false;
    }
  }, []);

  const completeWorkout = useCallback(
    async (id: string, completedDate: string) => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          'useWorkoutService: Completing workout with ID:',
          id,
          'and date:',
          completedDate,
        );
        const workout = await workoutService.completeWorkout(id, completedDate);
        console.log('useWorkoutService: Complete workout result:', workout);
        setLoading(false);
        return workout;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to complete workout';
        console.error(
          'useWorkoutService: Error completing workout:',
          errorMessage,
        );
        setError(errorMessage);
        setLoading(false);
        return null;
      }
    },
    [],
  );

  const getWorkoutsForDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const workouts = await workoutService.getWorkoutsForDate(date);
      setLoading(false);
      return workouts;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch workouts for date',
      );
      setLoading(false);
      return [];
    }
  }, []);

  return {
    loading,
    error,
    getWorkouts,
    getWorkoutById,
    saveWorkout,
    deleteWorkout,
    completeWorkout,
    getWorkoutsForDate,
  };
};
