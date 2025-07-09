import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Workout } from '../../../domain/entities/Workout';

interface WorkoutCardProps {
  workout: Workout;
  onPress: (workout: Workout) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workout,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(workout)}>
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.date}>{workout.date}</Text>
      <Text style={styles.exercises}>{workout.exercises.length} exercises</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exercises: {
    fontSize: 14,
    marginTop: 8,
  },
});
