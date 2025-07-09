import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Workout } from '../../../domain/entities/Workout';
import env from '../../../config/env';
import { useWorkoutService } from '../../hooks/useWorkoutService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationConfig';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const WorkoutListScreen = () => {
  // Navigation
  const navigation = useNavigation<NavigationProp>();

  // Use our custom hook that uses the domain layer
  const { getWorkouts, loading, error } = useWorkoutService();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Create a memoized fetch function
  const fetchWorkouts = useCallback(async () => {
    const result = await getWorkouts();
    setWorkouts(result);
  }, [getWorkouts]);

  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Handle workout item press
  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutDetail', { workoutId: workout.id });
  };

  // Render each workout item
  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutCard}
      onPress={() => handleWorkoutPress(item)}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDate}>Date: {item.date}</Text>
      <Text style={styles.workoutType}>Type: {item.type}</Text>
      <Text style={styles.workoutLocation}>Location: {item.location}</Text>
      <Text style={styles.workoutStatus}>
        Status: {item.completed ? 'Completed' : 'Planned'}
      </Text>
    </TouchableOpacity>
  );

  // Show loading indicator while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </SafeAreaView>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading workouts</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Workouts</Text>
        <Text style={styles.apiInfo}>API: {env.API_URL}</Text>
      </View>

      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No workouts found</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  apiInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  workoutCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  workoutType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  workoutLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  workoutStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066cc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#cc0000',
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default WorkoutListScreen;
