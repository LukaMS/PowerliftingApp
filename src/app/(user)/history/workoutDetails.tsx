import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Workout } from '@/types';
import ExerciseCardReadOnly from '@/components/ExerciseCardReadOnly';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkoutDetails } from '@/api/profile';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const WorkoutDetailScreen = () => {
  const route = useRoute();
  const router = useRouter();
  const { workout } = route.params as { workout: Workout };
  const workoutId = workout.id;
  const { data: details, isLoading, error } = useQuery({
    queryKey: ['workoutDetail', workoutId],
    queryFn: () => fetchWorkoutDetails(workoutId),
    enabled: !!workoutId,
  });

  if (isLoading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }
  if (error || !details) {
    console.log(error, details, workout.exercises);
    return (
      
      <SafeAreaView style={styles.container}>
        <Text>Error loading workout details</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color="#007AFF"
          style={styles.backIcon}
        />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <ScrollView>
        <Text style={styles.title}>{details.name}</Text>
        <Text style={styles.date}>{details.date}</Text>
        {details.exercises.map((exercise) => (
          <ExerciseCardReadOnly key={exercise.id} exercise={exercise} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default WorkoutDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  backButtonPressed: {
    opacity: 0.6,
  },
  backIcon: {
    marginRight: 6,
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
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
