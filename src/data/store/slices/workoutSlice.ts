import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Workout } from '../../../domain/entities/Workout';

// Define the state type
interface WorkoutState {
  selectedWorkout: Workout | null;
  selectedDate: string;
  completedWorkouts: string[]; // IDs of completed workouts
  filterType: 'all' | 'completed' | 'pending';
}

// Initial state
const initialState: WorkoutState = {
  selectedWorkout: null,
  selectedDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
  completedWorkouts: [],
  filterType: 'all',
};

// Create the slice
const workoutSlice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    // Select a workout
    selectWorkout: (state, action: PayloadAction<Workout | null>) => {
      state.selectedWorkout = action.payload;
    },

    // Set the selected date
    setSelectedDate: (state, action: PayloadAction<string>) => {
      state.selectedDate = action.payload;
    },

    // Mark a workout as completed
    markWorkoutCompleted: (state, action: PayloadAction<string>) => {
      if (!state.completedWorkouts.includes(action.payload)) {
        state.completedWorkouts.push(action.payload);
      }
    },

    // Mark a workout as not completed
    markWorkoutNotCompleted: (state, action: PayloadAction<string>) => {
      state.completedWorkouts = state.completedWorkouts.filter(
        id => id !== action.payload,
      );
    },

    // Set the filter type
    setFilterType: (
      state,
      action: PayloadAction<'all' | 'completed' | 'pending'>,
    ) => {
      state.filterType = action.payload;
    },
  },
});

// Export actions
export const {
  selectWorkout,
  setSelectedDate,
  markWorkoutCompleted,
  markWorkoutNotCompleted,
  setFilterType,
} = workoutSlice.actions;

// Export reducer
export default workoutSlice.reducer;
