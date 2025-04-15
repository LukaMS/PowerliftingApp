// app/(user)/workout/index.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useWorkout } from '@/providers/WorkoutProvider';
import WorkoutMiniBar from '@/components/workoutMiniBar';

export default function WorkoutScreen() {
  const router = useRouter();
  const { activeWorkout } = useWorkout();

  const startWorkout = () => {
    router.push('/(user)/workout/activeWorkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Start Workout</Text>
      <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
        <Text style={styles.buttonText}>Start Workout</Text>
      </TouchableOpacity>
      {activeWorkout && <WorkoutMiniBar />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9F9F9',
  },
  header: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600'
  }
});
