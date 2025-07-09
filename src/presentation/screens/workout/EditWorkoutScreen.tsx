import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationConfig';
import { useWorkoutService } from '../../hooks/useWorkoutService';
import {
  Workout,
  WorkoutType,
  WorkoutLocation,
} from '../../../domain/entities/Workout';
import {
  useForm,
  SubmitHandler,
  useFieldArray,
  Resolver,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  workoutSchema,
  WorkoutFormValues,
  addExerciseSchema,
  AddExerciseFormValues,
} from '../../../domain/validation/workoutSchema';
import FormInput from '../../components/form/FormInput';
import FormRadioGroup from '../../components/form/FormRadioGroup';

interface EditWorkoutScreenProps {
  route: RouteProp<RootStackParamList, 'EditWorkout'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditWorkout'>;
}

// Helper functions for radio options with user-friendly labels
const workoutTypeOptions = [
  { label: 'Strength Training', value: WorkoutType.STRENGTH },
  { label: 'Cardio', value: WorkoutType.CARDIO },
  { label: 'Flexibility', value: WorkoutType.FLEXIBILITY },
  { label: 'HIIT', value: WorkoutType.HIIT },
  { label: 'Custom', value: WorkoutType.CUSTOM },
];

const workoutLocationOptions = [
  { label: 'Home', value: WorkoutLocation.HOME },
  { label: 'Gym', value: WorkoutLocation.GYM },
  { label: 'Outdoor', value: WorkoutLocation.OUTDOOR },
  { label: 'Other', value: WorkoutLocation.OTHER },
];

const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({
  route,
  navigation,
}) => {
  const { workoutId } = route.params;

  // Use domain layer service instead of direct RTK Query
  const {
    loading: isLoading,
    getWorkoutById,
    saveWorkout,
  } = useWorkoutService();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Main form setup with react-hook-form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutSchema) as Resolver<WorkoutFormValues>,
    defaultValues: {
      name: '',
      date: '',
      time: '',
      type: WorkoutType.STRENGTH,
      location: WorkoutLocation.GYM,
      duration: '',
      calories: '',
      notes: '',
      exercises: [],
      completed: false,
      completedDate: '',
    },
  });

  // Field array for exercises
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exercises',
  });

  // Exercise form setup
  const {
    control: exerciseControl,
    handleSubmit: handleExerciseSubmit,
    reset: resetExerciseForm,
    formState: { errors: exerciseErrors },
  } = useForm<AddExerciseFormValues>({
    resolver: zodResolver(addExerciseSchema),
    defaultValues: {
      name: '',
      sets: undefined,
      reps: undefined,
      weight: undefined,
      restTime: undefined,
      notes: '',
    },
  });

  // Watch the completed status
  const completed = watch('completed');

  // Load workout data when available
  useEffect(() => {
    const loadWorkout = async () => {
      try {
        const fetchedWorkout = await getWorkoutById(workoutId);
        setWorkout(fetchedWorkout);
        reset({
          name: fetchedWorkout?.name,
          date: fetchedWorkout?.date,
          time: fetchedWorkout?.time || '',
          type: fetchedWorkout?.type,
          location: fetchedWorkout?.location,
          duration: fetchedWorkout?.duration
            ? Number(fetchedWorkout.duration)
            : '',
          calories: fetchedWorkout?.calories
            ? Number(fetchedWorkout.calories)
            : '',
          notes: fetchedWorkout?.notes || '',
          exercises: fetchedWorkout?.exercises,
          completed: fetchedWorkout?.completed || false,
          completedDate: fetchedWorkout?.completedDate || '',
        });
      } catch (error) {
        setFetchError('Failed to load workout');
        console.error('Failed to load workout:', error);
      }
    };

    loadWorkout();
  }, [workoutId, getWorkoutById, reset]);

  // Handle adding an exercise
  const onAddExercise: SubmitHandler<AddExerciseFormValues> = data => {
    append({
      ...data,
      id: Date.now().toString(),
    });
    resetExerciseForm();
  };

  // Handle saving the workout
  const onSubmit: SubmitHandler<WorkoutFormValues> = async data => {
    try {
      // Ensure all exercises have IDs
      const exercisesWithIds = data.exercises.map(exercise => ({
        ...exercise,
        id:
          exercise.id ||
          Date.now().toString() + Math.random().toString(36).substring(2, 9),
      }));

      const updatedWorkout: Workout = {
        id: workoutId,
        ...data,
        exercises: exercisesWithIds,
        // Convert empty strings to undefined for optional fields
        time: data.time || undefined,
        duration: data.duration ? Number(data.duration) : undefined,
        calories: data.calories ? Number(data.calories) : undefined,
        notes: data.notes || undefined,
        completedDate: data.completed
          ? workout?.completedDate || new Date().toISOString().split('T')[0]
          : undefined,
      };

      await saveWorkout(updatedWorkout);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update workout');
      console.error('Failed to update workout:', error);
    }
  };

  // Handle toggling completion status
  const handleToggleCompleted = () => {
    setValue('completed', !completed);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading workout...</Text>
      </View>
    );
  }

  if (fetchError) {
    return (
      <View style={styles.centered}>
        <Text>{fetchError}</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.centered}>
        <Text>Workout not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Workout Details</Text>

        <FormInput
          name="name"
          control={control}
          label="Name"
          placeholder="Workout Name"
          error={errors.name}
        />

        <FormInput
          name="date"
          control={control}
          label="Date"
          placeholder="YYYY-MM-DD"
          error={errors.date}
        />

        <FormInput
          name="time"
          control={control}
          label="Time (Optional)"
          placeholder="HH:MM"
          error={errors.time}
        />

        <FormRadioGroup
          name="type"
          control={control}
          label="Workout Type"
          options={workoutTypeOptions}
          error={errors.type}
        />

        <FormRadioGroup
          name="location"
          control={control}
          label="Location"
          options={workoutLocationOptions}
          error={errors.location}
        />

        <FormInput
          name="duration"
          control={control}
          label="Duration (minutes, optional)"
          placeholder="Duration in minutes"
          keyboardType="numeric"
          error={errors.duration}
        />

        <FormInput
          name="calories"
          control={control}
          label="Calories (optional)"
          placeholder="Estimated calories"
          keyboardType="numeric"
          error={errors.calories}
        />

        <FormInput
          name="notes"
          control={control}
          label="Notes (optional)"
          placeholder="Workout notes"
          multiline
          style={styles.textArea}
          error={errors.notes}
        />

        <TouchableOpacity
          style={[
            styles.completedButton,
            completed ? styles.completedButtonActive : {},
          ]}
          onPress={handleToggleCompleted}
        >
          <Text
            style={[
              styles.completedButtonText,
              completed ? styles.completedButtonTextActive : {},
            ]}
          >
            {completed ? 'Completed' : 'Mark as Completed'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Exercises</Text>

        {fields.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseItem}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>
                {index + 1}. {exercise.name}
              </Text>
              <TouchableOpacity onPress={() => remove(index)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.exerciseDetail}>
              {exercise.sets} sets x {exercise.reps} reps
              {exercise.weight ? ` @ ${exercise.weight}kg` : ''}
              {exercise.restTime ? `, ${exercise.restTime}s rest` : ''}
            </Text>
            {exercise.notes && (
              <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
            )}
          </View>
        ))}

        {errors.exercises && (
          <Text style={styles.errorText}>{errors.exercises.message}</Text>
        )}

        <View style={styles.addExerciseForm}>
          <Text style={styles.subSectionTitle}>Add Exercise</Text>

          <FormInput
            name="name"
            control={exerciseControl}
            label="Exercise Name"
            placeholder="Exercise Name"
            error={exerciseErrors.name}
          />

          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <FormInput
                name="sets"
                control={exerciseControl}
                label="Sets"
                placeholder="Sets"
                keyboardType="numeric"
                error={exerciseErrors.sets}
                containerStyle={styles.noMarginBottom}
              />
            </View>
            <View style={styles.halfColumn}>
              <FormInput
                name="reps"
                control={exerciseControl}
                label="Reps"
                placeholder="Reps"
                keyboardType="numeric"
                error={exerciseErrors.reps}
                containerStyle={styles.noMarginBottom}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.halfColumn}>
              <FormInput
                name="weight"
                control={exerciseControl}
                label="Weight (kg, optional)"
                placeholder="Weight"
                keyboardType="numeric"
                error={exerciseErrors.weight}
                containerStyle={styles.noMarginBottom}
              />
            </View>
            <View style={styles.halfColumn}>
              <FormInput
                name="restTime"
                control={exerciseControl}
                label="Rest Time (sec, optional)"
                placeholder="Rest Time"
                keyboardType="numeric"
                error={exerciseErrors.restTime}
                containerStyle={styles.noMarginBottom}
              />
            </View>
          </View>

          <FormInput
            name="notes"
            control={exerciseControl}
            label="Notes (optional)"
            placeholder="Exercise notes"
            multiline
            style={styles.textArea}
            error={exerciseErrors.notes}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleExerciseSubmit(onAddExercise)}
          >
            <Text style={styles.addButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSubmit(onSubmit)}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>
          {isLoading ? 'Saving...' : 'Save Workout'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSection: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfColumn: {
    width: '48%',
  },
  noMarginBottom: {
    marginBottom: 0,
  },
  completedButton: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  completedButtonActive: {
    backgroundColor: '#4CAF50',
  },
  completedButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  completedButtonTextActive: {
    color: 'white',
  },
  exerciseItem: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 4,
    marginBottom: 12,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    color: 'red',
    fontSize: 14,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#555',
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
    fontStyle: 'italic',
  },
  addExerciseForm: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
});

export default EditWorkoutScreen;
