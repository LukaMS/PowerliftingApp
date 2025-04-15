// WorkoutDetailScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Workout } from '@/types';
import ExerciseCardReadOnly from '@/components/ExerciseCardReadOnly';

const WorkoutDetailScreen = () => {
  const route = useRoute();
  const { workout } = route.params as { workout: Workout };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{workout.name}</Text>
      <Text style={styles.date}>{workout.date}</Text>
      {workout.exercises.map((exercise) => (
        <ExerciseCardReadOnly key={exercise.id} exercise={exercise} />
      ))}
    </ScrollView>
  );
};

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
});
