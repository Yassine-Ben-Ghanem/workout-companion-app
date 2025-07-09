import React, { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  Exercise,
  Workout,
  WorkoutType,
  WorkoutLocation,
} from '../../../domain/entities/Workout';

interface WorkoutFormProps {
  onSave: (workout: Workout) => void;
}

export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSave }) => {
  const [name, setName] = useState('');
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = () => {
    if (!exerciseName || !sets || !reps) return;

    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: exerciseName,
      sets: parseInt(sets, 10),
      reps: parseInt(reps, 10),
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setSets('');
    setReps('');
  };

  const handleSave = () => {
    if (!name || exercises.length === 0) return;

    const workout: Workout = {
      id: Date.now().toString(),
      name,
      date: new Date().toISOString().split('T')[0],
      exercises,
      completed: false,
      type: WorkoutType.STRENGTH,
      location: WorkoutLocation.GYM,
    };

    onSave(workout);
    setName('');
    setExercises([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Workout</Text>

      <TextInput
        style={styles.input}
        placeholder="Workout Name"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.exerciseForm}>
        <Text style={styles.subtitle}>Add Exercise</Text>
        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Sets"
            value={sets}
            onChangeText={setSets}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Reps"
            value={reps}
            onChangeText={setReps}
            keyboardType="numeric"
          />
        </View>
        <Button title="Add Exercise" onPress={addExercise} />
      </View>

      {exercises.length > 0 && (
        <View style={styles.exerciseList}>
          <Text style={styles.subtitle}>Exercises:</Text>
          {exercises.map((exercise, index) => (
            <Text key={exercise.id} style={styles.exerciseItem}>
              {index + 1}. {exercise.name} - {exercise.sets} sets x{' '}
              {exercise.reps} reps
            </Text>
          ))}
        </View>
      )}

      <Button
        title="Save Workout"
        onPress={handleSave}
        disabled={!name || exercises.length === 0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  exerciseForm: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  exerciseList: {
    marginVertical: 16,
  },
  exerciseItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});
