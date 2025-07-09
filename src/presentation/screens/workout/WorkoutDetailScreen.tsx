import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationConfig';
import { Workout } from '../../../domain/entities/Workout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutService } from '../../hooks/useWorkoutService';

interface WorkoutDetailScreenProps {
  route: RouteProp<RootStackParamList, 'WorkoutDetail'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'WorkoutDetail'>;
}

const WorkoutDetailScreen: React.FC<WorkoutDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { workoutId } = route.params;

  // Use domain layer service instead of direct RTK Query
  const {
    loading: isLoading,
    getWorkoutById,
    deleteWorkout: deleteWorkoutService,
    completeWorkout: completeWorkoutService,
  } = useWorkoutService();

  const [workout, setWorkout] = useState<Workout | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Fetch workout data
  const fetchWorkout = useCallback(async () => {
    console.log('WorkoutDetailScreen: Fetching workout with ID:', workoutId);
    try {
      const fetchedWorkout = await getWorkoutById(workoutId);
      console.log('WorkoutDetailScreen: Workout data:', fetchedWorkout);

      if (fetchedWorkout) {
        setWorkout(fetchedWorkout);
        setFetchError(null);
      } else {
        setFetchError(`No workout found with ID: ${workoutId}`);
      }
    } catch (error) {
      console.error('WorkoutDetailScreen: Error fetching workout:', error);
      setFetchError('Failed to load workout details');
    }
  }, [workoutId, getWorkoutById]);

  useEffect(() => {
    fetchWorkout();
  }, [fetchWorkout]);

  const handleCompleteWorkout = async () => {
    if (!workout) return;

    setIsCompleting(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      console.log(
        'WorkoutDetailScreen: Completing workout',
        workout.id,
        'with date',
        today,
      );

      const result = await completeWorkoutService(workout.id, today);

      if (result) {
        console.log(
          'WorkoutDetailScreen: Workout completed successfully',
          result,
        );
        setWorkout(result); // Update local state with completed workout
        Alert.alert('Success', 'Workout marked as completed!');
      } else {
        throw new Error('Failed to complete workout');
      }
    } catch (error) {
      console.error('WorkoutDetailScreen: Error completing workout:', error);
      Alert.alert(
        'Error',
        `There was a problem completing the workout: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Please try again later.`,
      );
    } finally {
      setIsCompleting(false);
    }
  };

  const handleEditWorkout = () => {
    if (!workout) return;

    navigation.navigate('EditWorkout', { workoutId: workout.id });
  };

  const handleDeleteWorkout = async () => {
    if (!workout) return;

    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              console.log('WorkoutDetailScreen: Deleting workout', workout.id);

              const success = await deleteWorkoutService(workout.id);

              if (success) {
                console.log(
                  'WorkoutDetailScreen: Workout deleted successfully',
                );
                Alert.alert('Success', 'Workout deleted successfully!', [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]);
              } else {
                throw new Error('Failed to delete workout');
              }
            } catch (error) {
              console.error(
                'WorkoutDetailScreen: Error deleting workout:',
                error,
              );
              Alert.alert(
                'Error',
                `Failed to delete workout: ${
                  error instanceof Error ? error.message : 'Unknown error'
                }`,
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  if (isLoading || isDeleting || isCompleting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>
          {isDeleting
            ? 'Deleting workout...'
            : isCompleting
            ? 'Completing workout...'
            : 'Loading workout details...'}
        </Text>
      </SafeAreaView>
    );
  }

  if (fetchError) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading workout</Text>
        <Text style={styles.errorDetail}>{fetchError}</Text>
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text>Workout ID: {workoutId}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!workout) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Workout not found</Text>
        <View style={styles.debugInfo}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text>Workout ID: {workoutId}</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.workoutName}>{workout.name}</Text>
          <Text style={styles.workoutDate}>Date: {workout.date}</Text>
          {workout.time && (
            <Text style={styles.workoutTime}>Time: {workout.time}</Text>
          )}
          <View style={styles.badgeContainer}>
            <View style={styles.typeBadge}>
              <Text style={styles.badgeText}>{workout.type}</Text>
            </View>
            <View style={styles.locationBadge}>
              <Text style={styles.badgeText}>{workout.location}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: workout.completed ? '#4CAF50' : '#FFC107',
                },
              ]}
            >
              <Text style={styles.badgeText}>
                {workout.completed ? 'Completed' : 'Planned'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercises</Text>
          {workout.exercises.map(exercise => (
            <View key={exercise.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetail}>
                {exercise.sets} sets × {exercise.reps} reps
                {exercise.weight ? ` × ${exercise.weight} kg` : ''}
              </Text>
              {exercise.restTime && (
                <Text style={styles.exerciseDetail}>
                  Rest: {exercise.restTime} seconds
                </Text>
              )}
              {exercise.notes && (
                <Text style={styles.exerciseNotes}>{exercise.notes}</Text>
              )}
            </View>
          ))}
        </View>

        {workout.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{workout.notes}</Text>
          </View>
        )}

        {workout.duration && (
          <View style={styles.metadataContainer}>
            <Text style={styles.metadataText}>
              Duration: {workout.duration} minutes
            </Text>
          </View>
        )}

        {workout.calories && (
          <View style={styles.metadataContainer}>
            <Text style={styles.metadataText}>
              Calories: {workout.calories} kcal
            </Text>
          </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditWorkout}
          >
            <Text style={styles.buttonText}>Edit Workout</Text>
          </TouchableOpacity>
          {!workout.completed && (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={handleCompleteWorkout}
            >
              <Text style={styles.buttonText}>Mark as Completed</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteWorkout}
          >
            <Text style={styles.deleteButtonText}>Delete Workout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  debugInfo: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#EEE',
    borderRadius: 8,
    width: '100%',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  backButton: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  workoutTime: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  typeBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  locationBadge: {
    backgroundColor: '#9C27B0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  badgeText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exerciseNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  metadataContainer: {
    marginBottom: 12,
  },
  metadataText: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    marginTop: 24,
  },
  editButton: {
    backgroundColor: '#FF9800',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#F44336',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkoutDetailScreen;
