import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Workout } from '../../../domain/entities/Workout';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkoutService } from '../../hooks/useWorkoutService';
import WeeklySummaryChart from '../../components/summary/WeeklySummaryChart';

const SummaryScreen: React.FC = () => {
  const [dateRange, setDateRange] = useState(() => {
    // Get the current date
    const today = new Date();
    // Get the first day of the current week (Sunday)
    const firstDay = new Date(today);
    firstDay.setDate(today.getDate() - today.getDay());
    // Get the last day of the current week (Saturday)
    const lastDay = new Date(firstDay);
    lastDay.setDate(firstDay.getDate() + 6);

    return {
      startDate: firstDay.toISOString().split('T')[0],
      endDate: lastDay.toISOString().split('T')[0],
    };
  });

  // Use domain layer service - get all workouts and filter on frontend
  const { loading: isLoading, getWorkouts } = useWorkoutService();
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);

  // Fetch all workouts once
  const fetchWorkouts = useCallback(async () => {
    try {
      const fetchedWorkouts = await getWorkouts();
      setAllWorkouts(fetchedWorkouts);
    } catch (error) {
      console.error('SummaryScreen: Error fetching workouts:', error);
      setAllWorkouts([]);
    }
  }, [getWorkouts]);

  // Fetch workouts on component mount
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Filter workouts by date range on the frontend
  const filteredWorkouts = useMemo(() => {
    if (!allWorkouts || allWorkouts.length === 0) return [];

    return allWorkouts.filter((workout: Workout) => {
      const workoutDate = workout.date;
      return (
        workoutDate >= dateRange.startDate && workoutDate <= dateRange.endDate
      );
    });
  }, [allWorkouts, dateRange.startDate, dateRange.endDate]);

  // Refetch function
  const refetch = () => {
    fetchWorkouts();
  };

  // Calculate summary statistics using filtered workouts
  const dailySummaries = useMemo(() => {
    console.log(
      'SummaryScreen: Calculating daily summaries for date range:',
      dateRange,
    );
    console.log('SummaryScreen: Total workouts:', allWorkouts.length);
    console.log('SummaryScreen: Filtered workouts:', filteredWorkouts.length);

    // Create daily summaries for the chart
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    return days.map((day, index) => {
      const date = new Date(dateRange.startDate);
      date.setDate(date.getDate() + index);
      const dateStr = date.toISOString().split('T')[0];

      const dayWorkouts = filteredWorkouts.filter(
        (w: Workout) => w.date === dateStr,
      );
      const completed = dayWorkouts.filter((w: Workout) => w.completed).length;

      console.log(
        `SummaryScreen: ${dateStr} - Total: ${dayWorkouts.length}, Completed: ${completed}`,
      );

      return {
        date: dateStr,
        workouts: dayWorkouts.length,
        completed: completed,
        duration: dayWorkouts.reduce(
          (sum: number, w: Workout) => sum + (w.duration || 0),
          0,
        ),
        calories: dayWorkouts.reduce(
          (sum: number, w: Workout) => sum + (w.calories || 0),
          0,
        ),
      };
    });
  }, [filteredWorkouts, dateRange, allWorkouts.length]);

  // Navigate to previous week
  const handlePreviousWeek = () => {
    const startDate = new Date(dateRange.startDate);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(dateRange.endDate);
    endDate.setDate(endDate.getDate() - 7);

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  // Navigate to next week
  const handleNextWeek = () => {
    const startDate = new Date(dateRange.startDate);
    startDate.setDate(startDate.getDate() + 7);
    const endDate = new Date(dateRange.endDate);
    endDate.setDate(endDate.getDate() + 7);

    setDateRange({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    });
  };

  // Refresh data
  const handleRefresh = () => {
    console.log('SummaryScreen: Manually refreshing data');
    refetch();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <ScrollView style={styles.container}>
        {/* Week selector */}
        <View style={styles.weekSelector}>
          <TouchableOpacity onPress={handlePreviousWeek}>
            <Text style={styles.weekNavButton}>← Previous</Text>
          </TouchableOpacity>
          <Text style={styles.weekTitle}>
            {new Date(dateRange.startDate).toLocaleDateString()} -{' '}
            {new Date(dateRange.endDate).toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={handleNextWeek}>
            <Text style={styles.weekNavButton}>Next →</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading summary...</Text>
          </View>
        ) : (
          <View style={styles.summaryContainer}>
            {/* Weekly Summary Chart */}
            <WeeklySummaryChart dailySummaries={dailySummaries} />

            {/* Refresh button */}
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={handleRefresh}
            >
              <Text style={styles.refreshButtonText}>Refresh Data</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
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
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4CAF50',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  weekNavButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  summaryContainer: {
    padding: 16,
  },
  detailedButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  detailedButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    marginBottom: 16,
  },
  errorDetail: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
    maxWidth: '90%',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
});

export default SummaryScreen;
