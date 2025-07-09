import workoutSlice, {
  selectWorkout,
  setSelectedDate,
  markWorkoutCompleted,
  markWorkoutNotCompleted,
  setFilterType,
} from '../../../data/store/slices/workoutSlice';
import {
  Workout,
  WorkoutType,
  WorkoutLocation,
} from '../../../domain/entities/Workout';

describe('workoutSlice', () => {
  const initialState = {
    selectedWorkout: null,
    selectedDate: new Date().toISOString().split('T')[0],
    completedWorkouts: [],
    filterType: 'all' as const,
  };

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

  describe('selectWorkout', () => {
    it('should set selectedWorkout when workout is provided', () => {
      const action = selectWorkout(mockWorkout);
      const result = workoutSlice(initialState, action);

      expect(result.selectedWorkout).toEqual(mockWorkout);
    });

    it('should set selectedWorkout to null when null is provided', () => {
      const stateWithWorkout = {
        ...initialState,
        selectedWorkout: mockWorkout,
      };
      const action = selectWorkout(null);
      const result = workoutSlice(stateWithWorkout, action);

      expect(result.selectedWorkout).toBeNull();
    });
  });

  describe('setSelectedDate', () => {
    it('should update selectedDate', () => {
      const newDate = '2023-12-25';
      const action = setSelectedDate(newDate);
      const result = workoutSlice(initialState, action);

      expect(result.selectedDate).toBe(newDate);
    });
  });

  describe('markWorkoutCompleted', () => {
    it('should add workout ID to completedWorkouts', () => {
      const workoutId = '123';
      const action = markWorkoutCompleted(workoutId);
      const result = workoutSlice(initialState, action);

      expect(result.completedWorkouts).toContain(workoutId);
      expect(result.completedWorkouts).toHaveLength(1);
    });

    it('should not add duplicate workout ID to completedWorkouts', () => {
      const workoutId = '123';
      const stateWithCompleted = {
        ...initialState,
        completedWorkouts: [workoutId],
      };
      const action = markWorkoutCompleted(workoutId);
      const result = workoutSlice(stateWithCompleted, action);

      expect(result.completedWorkouts).toHaveLength(1);
      expect(result.completedWorkouts).toContain(workoutId);
    });
  });

  describe('markWorkoutNotCompleted', () => {
    it('should remove workout ID from completedWorkouts', () => {
      const workoutId = '123';
      const stateWithCompleted = {
        ...initialState,
        completedWorkouts: [workoutId, '456'],
      };
      const action = markWorkoutNotCompleted(workoutId);
      const result = workoutSlice(stateWithCompleted, action);

      expect(result.completedWorkouts).not.toContain(workoutId);
      expect(result.completedWorkouts).toContain('456');
      expect(result.completedWorkouts).toHaveLength(1);
    });

    it('should handle removing non-existent workout ID', () => {
      const action = markWorkoutNotCompleted('nonexistent');
      const result = workoutSlice(initialState, action);

      expect(result.completedWorkouts).toHaveLength(0);
    });
  });

  describe('setFilterType', () => {
    it('should update filterType to completed', () => {
      const action = setFilterType('completed');
      const result = workoutSlice(initialState, action);

      expect(result.filterType).toBe('completed');
    });

    it('should update filterType to pending', () => {
      const action = setFilterType('pending');
      const result = workoutSlice(initialState, action);

      expect(result.filterType).toBe('pending');
    });

    it('should update filterType to all', () => {
      const stateWithFilter = {
        ...initialState,
        filterType: 'completed' as const,
      };
      const action = setFilterType('all');
      const result = workoutSlice(stateWithFilter, action);

      expect(result.filterType).toBe('all');
    });
  });

  describe('multiple actions', () => {
    it('should handle complex state changes', () => {
      let state = workoutSlice(initialState, selectWorkout(mockWorkout));
      state = workoutSlice(state, setSelectedDate('2023-12-25'));
      state = workoutSlice(state, markWorkoutCompleted('1'));
      state = workoutSlice(state, setFilterType('completed'));

      expect(state.selectedWorkout).toEqual(mockWorkout);
      expect(state.selectedDate).toBe('2023-12-25');
      expect(state.completedWorkouts).toContain('1');
      expect(state.filterType).toBe('completed');
    });
  });
});
