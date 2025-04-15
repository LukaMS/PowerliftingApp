import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useWorkout } from '@/providers/WorkoutProvider';
import { useRouter } from 'expo-router';
import ExerciseCard from '@/components/ExerciseCard';

// Helper: formats seconds as "m:ss"
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

const WorkoutModal = () => {
  const { timer, startTimer, stopTimer, resetTimer, exercises, removeExercise } = useWorkout();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      startTimer();
      return () => {
        // Timer continues to run when the screen loses focus.
      };
    }, [])
  );

  const finishWorkout = () => {
    stopTimer();
    resetTimer();
    router.back();
  };

  // Navigate to the add exercise pop-up.
  const handleAddExercise = () => {
    router.push('/(user)/workout/addExercise');
  };

  return (
    <View style={styles.modalContainer}>
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Workout</Text>
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
        <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
          <Text style={styles.finishButtonText}>Finish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {exercises && exercises.length > 0 ? (
          <View style={styles.exercisesWrapper}>
            <FlatList
              data={exercises}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ExerciseCard
                  exerciseName={item.name}
                  onDelete={() => removeExercise(item.id)}
                />
              )}
              contentContainerStyle={styles.exercisesList}
            />
            <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // When no exercise is selected, center the placeholder and the button.
          <View style={styles.placeholderWrapper}>
            <Text style={styles.inProgressText}>Workout In Progress</Text>
            <TouchableOpacity style={styles.addExerciseButton} onPress={handleAddExercise}>
              <Text style={styles.addExerciseText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default WorkoutModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  timerText: {
    fontSize: 18,
    color: '#333',
  },
  finishButton: {
    backgroundColor: 'green',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 10,
    // Removed justifyContent: 'center' so content flows naturally from the top
  },
  placeholderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inProgressText: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  exercisesWrapper: {
    paddingTop: 10,
  },
  addExerciseButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal:20,
    borderRadius: 8,
  },
  addExerciseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  exercisesList: {
    paddingBottom: 10, // Ensure there's some space below the list before the button
  },
});
