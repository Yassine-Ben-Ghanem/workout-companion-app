import { z } from 'zod';
import { WorkoutType, WorkoutLocation } from '../entities/Workout';

// Exercise schema
export const exerciseSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Exercise name is required' }),
  sets: z.coerce
    .number()
    .int({ message: 'Sets must be a whole number' })
    .min(1, { message: 'At least 1 set is required' }),
  reps: z.coerce
    .number()
    .int({ message: 'Reps must be a whole number' })
    .min(1, { message: 'At least 1 rep is required' }),
  weight: z.coerce
    .number()
    .int({ message: 'Weight must be a whole number' })
    .min(0, { message: 'Weight cannot be negative' })
    .optional(),
  restTime: z.coerce
    .number()
    .int({ message: 'Rest time must be a whole number' })
    .min(0, { message: 'Rest time cannot be negative' })
    .optional(),
  notes: z.string().optional(),
});

// For form inputs we need a slightly different schema that allows for empty ID
export const exerciseFormSchema = exerciseSchema.extend({
  id: z.string().optional(),
});

// Date validation helper
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

// Workout schema for validation
export const workoutSchema = z.object({
  name: z.string().min(1, { message: 'Workout name is required' }),
  date: z
    .string()
    .regex(dateRegex, { message: 'Date must be in YYYY-MM-DD format' }),
  time: z
    .string()
    .regex(timeRegex, { message: 'Time must be in HH:MM format' })
    .optional()
    .or(z.literal('')),
  type: z.nativeEnum(WorkoutType),
  location: z.nativeEnum(WorkoutLocation),
  duration: z.coerce
    .number()
    .int({ message: 'Duration must be a whole number' })
    .min(1, { message: 'Duration must be at least 1 minute' })
    .optional()
    .or(z.literal('')),
  calories: z.coerce
    .number()
    .int({ message: 'Calories must be a whole number' })
    .min(0, { message: 'Calories cannot be negative' })
    .optional()
    .or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  exercises: z.array(exerciseFormSchema).min(1, {
    message: 'At least one exercise is required',
  }),
  completed: z.boolean().default(false),
  completedDate: z.string().optional(),
});

// Schema for adding a single exercise to the form
export const addExerciseSchema = exerciseFormSchema.omit({ id: true });

// Types derived from schemas
export type WorkoutFormValues = z.infer<typeof workoutSchema>;
export type ExerciseFormValues = z.infer<typeof exerciseFormSchema>;
export type AddExerciseFormValues = z.infer<typeof addExerciseSchema>;
