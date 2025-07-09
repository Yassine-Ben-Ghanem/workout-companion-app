import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorkoutListScreen from '../../../presentation/screens/workout/WorkoutListScreen';
import WorkoutDetailScreen from '../../../presentation/screens/workout/WorkoutDetailScreen';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import {
  Workout,
  WorkoutType,
  WorkoutLocation,
} from '../../../domain/entities/Workout';

// Mock the hooks
jest.mock('../../../presentation/hooks/useWorkoutService', () => ({
  useWorkoutService: jest.fn(),
}));

jest.mock('../../../presentation/hooks/useWeatherService', () => ({
  useWeatherService: jest.fn(),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => inset,
  };
});

// Mock MMKV Storage
jest.mock('../../../data/storage/mmkv', () => ({
  mmkv: {
    set: jest.fn(),
    getString: jest.fn().mockReturnValue(null),
  },
}));

// Create a mock store
const mockStore = configureStore([]);

// Create mock workouts
const mockWorkouts: Workout[] = [
  {
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
  },
  {
    id: '2',
    name: 'Evening Strength',
    date: '2023-10-16',
    type: WorkoutType.STRENGTH,
    location: WorkoutLocation.GYM,
    completed: true,
    exercises: [
      {
        id: 'ex2',
        name: 'Bench Press',
        sets: 3,
        reps: 10,
        weight: 60,
        restTime: 90,
      },
    ],
  },
];

// Define the navigation types
type RootStackParamList = {
  WorkoutList: undefined;
  WorkoutDetail: { workoutId: string };
};

// Create a mock navigation stack
const Stack = createNativeStackNavigator<RootStackParamList>();

describe('WorkoutListToDetail Integration', () => {
  const mockUseWorkoutService =
    require('../../../presentation/hooks/useWorkoutService').useWorkoutService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the useWorkoutService hook for all domain operations
    mockUseWorkoutService.mockReturnValue({
      getWorkouts: jest.fn().mockResolvedValue(mockWorkouts),
      getWorkoutById: jest
        .fn()
        .mockImplementation((id: string) =>
          Promise.resolve(mockWorkouts.find(w => w.id === id)),
        ),
      loading: false,
      error: null,
      completeWorkout: jest.fn().mockResolvedValue(true),
      deleteWorkout: jest.fn().mockResolvedValue(true),
    });
  });

  test('should navigate from workout list to workout detail', async () => {
    // Create a mock store
    const store = mockStore({
      // Add any required state here
    });

    // Render the navigation container with both screens
    const { getByText, queryByText } = render(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="WorkoutList" component={WorkoutListScreen} />
            <Stack.Screen
              name="WorkoutDetail"
              component={WorkoutDetailScreen as any}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>,
    );

    // Wait for the workout list to load
    await waitFor(() => {
      expect(getByText('Morning Cardio')).toBeTruthy();
      expect(getByText('Evening Strength')).toBeTruthy();
    });

    // Click on the first workout
    fireEvent.press(getByText('Morning Cardio'));

    // Wait for the workout detail to load
    await waitFor(() => {
      expect(getByText('Morning Cardio')).toBeTruthy();
      expect(getByText('Date: 2023-10-15')).toBeTruthy();
      expect(getByText('Running')).toBeTruthy();

      // Verify we're on the detail screen by checking for elements only on that screen
      expect(getByText('Mark as Completed')).toBeTruthy();
      expect(getByText('Delete Workout')).toBeTruthy();

      // Verify we don't see the second workout anymore
      expect(queryByText('Evening Strength')).toBeNull();
    });
  });
});
