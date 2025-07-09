import { baseApi } from './baseApi';
import { Workout } from '../../domain/entities/Workout';

// Define workout API endpoints
export const workoutApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Get all workouts
    getWorkouts: builder.query<Workout[], void>({
      query: () => 'workouts',
      providesTags: result =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Workouts' as const, id })),
              { type: 'Workouts', id: 'LIST' },
            ]
          : [{ type: 'Workouts', id: 'LIST' }],
    }),

    // Get a single workout by ID
    getWorkoutById: builder.query<Workout, string>({
      query: id => `workouts/${id}`,
      providesTags: (_, __, id) => [{ type: 'Workouts', id }],
    }),

    // Add a new workout
    addWorkout: builder.mutation<Workout, Omit<Workout, 'id'>>({
      query: workout => ({
        url: 'workouts',
        method: 'POST',
        body: workout,
      }),
      invalidatesTags: [
        { type: 'Workouts', id: 'LIST' },
        { type: 'Workouts', id: 'DATE' },
        { type: 'Workouts', id: 'RANGE' },
      ],
    }),

    // Update an existing workout
    updateWorkout: builder.mutation<Workout, Partial<Workout> & { id: string }>(
      {
        query: ({ id, ...workout }) => ({
          url: `workouts/${id}`,
          method: 'PUT',
          body: workout,
        }),
        invalidatesTags: (_, __, { id }) => [
          { type: 'Workouts', id },
          { type: 'Workouts', id: 'LIST' },
          { type: 'Workouts', id: 'DATE' },
          { type: 'Workouts', id: 'RANGE' },
        ],
      },
    ),

    // Delete a workout
    deleteWorkout: builder.mutation<void, string>({
      query: id => ({
        url: `workouts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'Workouts', id },
        { type: 'Workouts', id: 'LIST' },
        { type: 'Workouts', id: 'DATE' },
        { type: 'Workouts', id: 'RANGE' },
      ],
    }),

    // Mark a workout as completed
    completeWorkout: builder.mutation<
      Workout,
      { id: string; completedDate: string }
    >({
      query: ({ id, completedDate }) => ({
        url: `workouts/${id}`,
        method: 'PATCH',
        body: { completed: true, completedDate },
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'Workouts', id },
        { type: 'Workouts', id: 'LIST' },
        { type: 'Workouts', id: 'DATE' },
        { type: 'Workouts', id: 'RANGE' },
      ],
    }),

    // Get workouts for a specific date
    getWorkoutsForDate: builder.query<Workout[], string>({
      query: date => `workouts?date=${date}`,
      providesTags: [{ type: 'Workouts', id: 'DATE' }],
    }),
  }),
  overrideExisting: true,
});

// Export hooks for usage in components
export const {
  useGetWorkoutsQuery,
  useGetWorkoutByIdQuery,
  useAddWorkoutMutation,
  useUpdateWorkoutMutation,
  useDeleteWorkoutMutation,
  useCompleteWorkoutMutation,
  useGetWorkoutsForDateQuery,
} = workoutApi;
