import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationConfig';
import { Workout, WorkoutType } from '../../../domain/entities/Workout';
import { useAppSelector, useAppDispatch } from '../../../data/store/hooks';
import { setFilterType } from '../../../data/store/slices/workoutSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutService } from '../../hooks/useWorkoutService';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WorkoutsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const filterType = useAppSelector(state => state.workout.filterType);
  const [selectedType, setSelectedType] = useState<WorkoutType | 'ALL'>('ALL');

  // Use domain layer service instead of direct RTK Query
  const { loading: isLoading, getWorkouts } = useWorkoutService();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch workouts
  const fetchWorkouts = useCallback(async () => {
    try {
      const fetchedWorkouts = await getWorkouts();
      setWorkouts(fetchedWorkouts);
      setError(null);
    } catch (err) {
      console.error('WorkoutsScreen: Error fetching workouts:', err);
      setError('Failed to load workouts');
      setWorkouts([]);
    }
  }, [getWorkouts]);

  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Filter workouts based on selected filters
  const filteredWorkouts = workouts?.filter(workout => {
    // Filter by completion status
    if (filterType === 'completed' && !workout.completed) return false;
    if (filterType === 'pending' && workout.completed) return false;

    // Filter by workout type
    if (selectedType !== 'ALL' && workout.type !== selectedType) return false;

    return true;
  });

  // Navigate to workout detail
  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutDetail', { workoutId: workout.id });
  };

  // Navigate to create workout screen
  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  // Filter by completion status
  const handleFilterChange = (filter: 'all' | 'completed' | 'pending') => {
    dispatch(setFilterType(filter));
  };

  // Filter by workout type
  const handleTypeFilter = (type: WorkoutType | 'ALL') => {
    setSelectedType(type);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.container}>
        {/* Header with filters */}
        <View style={styles.header}>
          <Text style={styles.title}>My Workouts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateWorkout}
          >
            <Text style={styles.addButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Status filters */}
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'all' && styles.activeFilter,
            ]}
            onPress={() => handleFilterChange('all')}
          >
            <Text
              style={[
                styles.filterText,
                filterType === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'completed' && styles.activeFilter,
            ]}
            onPress={() => handleFilterChange('completed')}
          >
            <Text
              style={[
                styles.filterText,
                filterType === 'completed' && styles.activeFilterText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterType === 'pending' && styles.activeFilter,
            ]}
            onPress={() => handleFilterChange('pending')}
          >
            <Text
              style={[
                styles.filterText,
                filterType === 'pending' && styles.activeFilterText,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>
        </View>

        {/* Type filters */}
        <View style={styles.typeFilterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === 'ALL' && styles.activeTypeFilter,
              ]}
              onPress={() => handleTypeFilter('ALL')}
            >
              <Text
                style={[
                  styles.typeText,
                  selectedType === 'ALL' && styles.activeTypeText,
                ]}
              >
                ALL
              </Text>
            </TouchableOpacity>
            {Object.values(WorkoutType).map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.typeButton,
                  selectedType === type && styles.activeTypeFilter,
                ]}
                onPress={() => handleTypeFilter(type)}
              >
                <Text
                  style={[
                    styles.typeText,
                    selectedType === type && styles.activeTypeText,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Workouts list */}
        {isLoading ? (
          <View style={styles.centered}>
            <Text style={styles.message}>Loading workouts...</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorMessage}>Error loading workouts</Text>
          </View>
        ) : filteredWorkouts && filteredWorkouts.length > 0 ? (
          <FlatList
            data={filteredWorkouts}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.workoutCard,
                  item.completed && styles.completedWorkout,
                ]}
                onPress={() => handleWorkoutPress(item)}
              >
                <Text style={styles.workoutName}>{item.name}</Text>
                <View style={styles.workoutDetails}>
                  <Text style={styles.workoutDate}>{item.date}</Text>
                  <Text style={styles.workoutType}>{item.type}</Text>
                </View>
                <View style={styles.workoutStats}>
                  <Text style={styles.workoutExercises}>
                    {item.exercises.length} exercises
                  </Text>
                  {item.duration && (
                    <Text style={styles.workoutDuration}>
                      {item.duration} min
                    </Text>
                  )}
                </View>
                {item.completed && (
                  <View style={styles.completedBadge}>
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.message}>No workouts found</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={handleCreateWorkout}
            >
              <Text style={styles.createButtonText}>Create Workout</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  typeFilterContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  activeTypeFilter: {
    backgroundColor: '#4CAF50',
  },
  typeText: {
    color: '#666',
  },
  activeTypeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
  },
  workoutCard: {
    backgroundColor: 'white',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  completedWorkout: {
    backgroundColor: '#E8F5E9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
  workoutType: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  workoutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workoutExercises: {
    fontSize: 14,
    color: '#666',
  },
  workoutDuration: {
    fontSize: 14,
    color: '#666',
  },
  completedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WorkoutsScreen;
