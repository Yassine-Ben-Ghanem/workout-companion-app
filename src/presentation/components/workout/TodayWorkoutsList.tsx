import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Workout } from '../../../domain/entities/Workout';
import { useWorkoutService } from '../../hooks/useWorkoutService';

type RootStackParamList = {
  WorkoutDetail: { workoutId: string };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TodayWorkoutsList: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { getWorkoutsForDate, loading, error } = useWorkoutService();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Use a callback to fetch today's workouts
  const fetchTodayWorkouts = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];
    const result = await getWorkoutsForDate(today);
    setWorkouts(result);
  }, [getWorkoutsForDate]);

  useEffect(() => {
    fetchTodayWorkouts();
  }, [fetchTodayWorkouts]);

  const handleWorkoutPress = (workoutId: string) => {
    navigation.navigate('WorkoutDetail', { workoutId });
  };

  const renderWorkoutItem = ({ item }: { item: Workout }) => (
    <TouchableOpacity
      style={styles.workoutItem}
      onPress={() => handleWorkoutPress(item.id)}
    >
      <View style={styles.workoutHeader}>
        <Text style={styles.workoutName}>{item.name}</Text>
        {item.time && <Text style={styles.workoutTime}>{item.time}</Text>}
      </View>
      <View style={styles.workoutInfo}>
        <View style={styles.workoutType}>
          <Text style={styles.infoText}>{item.type}</Text>
        </View>
        <View
          style={[
            styles.workoutStatus,
            item.completed ? styles.completedStatus : styles.plannedStatus,
          ]}
        >
          <Text style={styles.statusText}>
            {item.completed ? 'Completed' : 'Planned'}
          </Text>
        </View>
      </View>
      <Text style={styles.exerciseCount}>
        {item.exercises.length} exercise{item.exercises.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (workouts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No workouts scheduled for today</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Workouts</Text>
      <FlatList
        data={workouts}
        renderItem={renderWorkoutItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginHorizontal: 16,
    marginTop: 16,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  workoutItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  workoutInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  workoutType: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  infoText: {
    color: '#2196F3',
    fontSize: 12,
    fontWeight: '500',
  },
  workoutStatus: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  exerciseCount: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#cc0000',
    textAlign: 'center',
    fontSize: 16,
  },
  completedStatus: {
    backgroundColor: '#4CAF50',
  },
  plannedStatus: {
    backgroundColor: '#FFC107',
  },
});

export default TodayWorkoutsList;
