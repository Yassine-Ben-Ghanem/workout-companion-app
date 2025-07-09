import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/navigationConfig';
import { useAppSelector, useAppDispatch } from '../../../data/store/hooks';
import { setSelectedDate } from '../../../data/store/slices/workoutSlice';
import { Workout } from '../../../domain/entities/Workout';
import { useWorkoutService } from '../../hooks/useWorkoutService';
import { useWeatherService } from '../../hooks/useWeatherService';
import { SafeAreaView } from 'react-native-safe-area-context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TodayScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useAppDispatch();
  const [location, _setLocation] = useState('Tunis'); // Default location
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const selectedDate = useAppSelector(state => state.workout.selectedDate);

  // Use workout service for domain layer abstraction
  const { loading: workoutsLoading, getWorkoutsForDate } = useWorkoutService();

  // Use weather service instead of direct API
  const {
    weather,
    loading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useWeatherService(location);

  // Function to fetch workouts
  const fetchWorkouts = React.useCallback(async () => {
    if (selectedDate) {
      const fetchedWorkouts = await getWorkoutsForDate(selectedDate);
      setWorkouts(fetchedWorkouts);
    }
  }, [selectedDate, getWorkoutsForDate]);

  // Set today's date when component mounts
  useEffect(() => {
    dispatch(setSelectedDate(today));
  }, [dispatch, today]);

  // Fetch workouts when date changes
  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // Refresh workouts when screen comes into focus (e.g., returning from CreateWorkout)
  useFocusEffect(
    React.useCallback(() => {
      fetchWorkouts();
    }, [fetchWorkouts]),
  );

  // Navigate to workout detail
  const handleWorkoutPress = (workout: Workout) => {
    navigation.navigate('WorkoutDetail', { workoutId: workout.id });
  };

  // Navigate to create workout screen
  const handleCreateWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  // Open weather modal
  const handleWeatherPress = () => {
    setWeatherModalVisible(true);
  };

  // Render weather card
  const renderWeatherCard = () => {
    if (weatherLoading) {
      return (
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>Weather</Text>
          <ActivityIndicator size="small" color="#4CAF50" />
        </View>
      );
    }

    if (weatherError) {
      return (
        <TouchableOpacity
          style={styles.weatherCard}
          onPress={handleWeatherPress}
        >
          <Text style={styles.weatherTitle}>Weather</Text>
          <Text style={styles.weatherError}>Tap to check weather</Text>
        </TouchableOpacity>
      );
    }

    if (!weather) {
      return (
        <TouchableOpacity
          style={styles.weatherCard}
          onPress={handleWeatherPress}
        >
          <Text style={styles.weatherTitle}>Weather</Text>
          <Text style={styles.weatherMessage}>Tap to check weather</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={styles.weatherCard} onPress={handleWeatherPress}>
        <Text style={styles.weatherTitle}>Weather</Text>
        <View style={styles.weatherContent}>
          <View style={styles.weatherMain}>
            <Text style={styles.weatherTemp}>{weather.temperature}°C</Text>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
          </View>
          {weather.icon && (
            <Image
              source={{ uri: `https:${weather.icon}` }}
              style={styles.weatherIcon}
              resizeMode="contain"
            />
          )}
        </View>
        <Text style={styles.weatherLocation}>{weather.location}</Text>
      </TouchableOpacity>
    );
  };

  // Get workout recommendation based on weather
  const getWorkoutRecommendation = () => {
    if (!weather) return null;

    const { temperature, condition } = weather;
    const lowercaseCondition = condition.toLowerCase();

    if (
      lowercaseCondition.includes('rain') ||
      lowercaseCondition.includes('storm') ||
      lowercaseCondition.includes('snow')
    ) {
      return "Weather conditions aren't ideal for outdoor workouts. Consider an indoor workout today.";
    }

    if (temperature < 5) {
      return "It's very cold outside. If you're going for an outdoor workout, wear warm layers and don't forget to warm up properly.";
    }

    if (temperature > 30) {
      return "It's very hot outside. If you're planning an outdoor workout, stay hydrated, wear sunscreen, and consider exercising during cooler parts of the day.";
    }

    if (
      lowercaseCondition.includes('cloud') ||
      lowercaseCondition.includes('overcast')
    ) {
      return 'Good conditions for outdoor exercise. Not too sunny, but remember to stay hydrated.';
    }

    if (
      lowercaseCondition.includes('sun') ||
      lowercaseCondition.includes('clear')
    ) {
      return "Great day for outdoor activities! Don't forget sunscreen and stay hydrated.";
    }

    return 'Conditions are suitable for outdoor workouts. Enjoy your exercise!';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <View style={styles.container}>
        {/* Header with date */}
        <View style={styles.header}>
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: '2-digit',
              year: 'numeric',
            })}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateWorkout}
          >
            <Text style={styles.addButtonText}>Add Workout</Text>
          </TouchableOpacity>
        </View>

        {/* Weather preview */}
        {renderWeatherCard()}

        {/* Workouts list */}
        <View style={styles.workoutsContainer}>
          <Text style={styles.sectionTitle}>Today's Workouts</Text>

          {workoutsLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.message}>Loading workouts...</Text>
            </View>
          ) : workouts && workouts.length > 0 ? (
            <FlatList
              data={workouts}
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
                  <Text style={styles.workoutTime}>
                    {item.time || 'No time set'}
                  </Text>
                  <Text style={styles.workoutType}>{item.type}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.message}>
                No workouts scheduled for today
              </Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateWorkout}
              >
                <Text style={styles.createButtonText}>Create Workout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Weather Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={weatherModalVisible}
          onRequestClose={() => setWeatherModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Weather Details</Text>

              {weatherLoading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : weatherError ? (
                <View>
                  <Text style={styles.errorMessage}>
                    Error loading weather data
                  </Text>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => {
                      refetchWeather();
                    }}
                  >
                    <Text style={styles.refreshButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              ) : weather ? (
                <View>
                  <Text style={styles.locationName}>{weather.location}</Text>
                  <View style={styles.weatherDetailsContainer}>
                    {weather.icon && (
                      <Image
                        source={{ uri: `https:${weather.icon}` }}
                        style={styles.modalWeatherIcon}
                        resizeMode="contain"
                      />
                    )}
                    <View>
                      <Text style={styles.modalTemperature}>
                        {weather.temperature}°C
                      </Text>
                      <Text style={styles.modalCondition}>
                        {weather.condition}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.weatherDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>
                        {weather.humidity}%
                      </Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Wind</Text>
                      <Text style={styles.detailValue}>
                        {weather.windSpeed} km/h
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationTitle}>
                      Workout Recommendation
                    </Text>
                    <Text style={styles.recommendationText}>
                      {getWorkoutRecommendation()}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text style={styles.message}>No weather data available</Text>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setWeatherModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  dateText: {
    fontSize: 18,
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
  weatherCard: {
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
  weatherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  weatherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherMain: {
    flex: 1,
  },
  weatherTemp: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherCondition: {
    fontSize: 16,
    color: '#666',
  },
  weatherLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  weatherError: {
    color: '#F44336',
    fontSize: 14,
  },
  weatherMessage: {
    color: '#666',
    fontSize: 14,
  },
  workoutsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  workoutCard: {
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
  completedWorkout: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  workoutType: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#F44336',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginTop: 16,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  weatherDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  modalWeatherIcon: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  modalTemperature: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  modalCondition: {
    fontSize: 18,
    color: '#666',
  },
  weatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  recommendationContainer: {
    marginVertical: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 16,
    alignSelf: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default TodayScreen;
