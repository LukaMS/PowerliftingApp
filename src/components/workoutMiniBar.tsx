// components/WorkoutMiniBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useWorkout } from '@/providers/WorkoutProvider';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

const WorkoutMiniBar = () => {
  const { timer } = useWorkout();
  const router = useRouter();

  const handlePress = () => {
    router.push('/(user)/workout/activeWorkout');
  };
    
  return (
    <TouchableOpacity
      style={[styles.barContainer, {bottom: 0 }]}
      onPress={handlePress}
    >
      <Text style={styles.barText}>Workout in progress: {formatTime(timer)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    padding: 10,
    alignItems: 'center',
  },
  barText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WorkoutMiniBar;
