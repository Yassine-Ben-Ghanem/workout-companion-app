import { LinkingOptions } from '@react-navigation/native';

// Define the root stack parameter list
export type RootStackParamList = {
  Home: undefined;
  WorkoutDetail: { workoutId: string };
  CreateWorkout: undefined;
  EditWorkout: { workoutId: string };
};

// Define the tab parameter list
export type TabParamList = {
  Today: undefined;
  Workouts: undefined;
  Summary: undefined;
};

// Define the deep linking configuration
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['workoutcompanion://', 'https://workoutcompanion.app'],
  config: {
    screens: {
      Home: {
        path: 'home',
      },
      WorkoutDetail: {
        path: 'workout/:workoutId',
        parse: {
          workoutId: (workoutId: string) => workoutId,
        },
      },
      CreateWorkout: 'create-workout',
      EditWorkout: {
        path: 'edit-workout/:workoutId',
        parse: {
          workoutId: (workoutId: string) => workoutId,
        },
      },
    },
  },
};
