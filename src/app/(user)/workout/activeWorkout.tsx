import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Button, Keyboard, TouchableWithoutFeedback, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useWorkout } from '@/providers/WorkoutProvider';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { saveWorkout } from '@/api/profile';
import { useQueryClient } from '@tanstack/react-query';
import ExerciseCard from '@/components/ExerciseCard';
import { ExercisePicker } from '@/components/ExercisePicker';
import { Exercise } from '@/types';

// Helper: formats seconds as "m:ss"
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
};

const WorkoutModal = () => {
  const workoutCtx = useWorkout();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [pickerVisible, setPickerVisible] = useState(false);
  

  useFocusEffect(
    useCallback(() => {
      if (!workoutCtx.activeWorkout) {
        workoutCtx.startWorkout();
      }
      return () => {};
    }, [])
  );

  const finishWorkout = async () => {
    const currentWorkout = workoutCtx.getWorkout();
    console.log('Workout:', JSON.stringify(currentWorkout, null, 2));
    try {
      const userId = session?.user.id;
      if (!userId) throw new Error('User not signed in');
      await saveWorkout(currentWorkout, userId);
      // refresh history and profile counts
      queryClient.invalidateQueries({ queryKey: ['workouts', userId] });
      queryClient.invalidateQueries({ queryKey: ['workoutCount', userId] });
    } catch (e: any) {
      Alert.alert('Error saving workout', e.message || String(e));
    }
    workoutCtx.stopWorkout();
    workoutCtx.resetTimer();
    router.back();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.modalContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>{workoutCtx.name}</Text>
            <Text style={styles.timerText}>{formatTime(workoutCtx.timer)}</Text>
          </View>
          <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          {workoutCtx.exercises && workoutCtx.exercises.length > 0 ? (
            <View style={styles.exercisesWrapper}>
              <FlatList
                data={workoutCtx.exercises}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <ExerciseCard
                    exercise={item}
                    onDelete={() => workoutCtx.removeExercise(item.id)}
                    onUpdate={workoutCtx.updateExercise}
                  />
                )}
                contentContainerStyle={styles.exercisesList}
              />
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setPickerVisible(true)}
              >
                <Text style={styles.addExerciseText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderWrapper}>
              <Text style={styles.inProgressText}>Workout In Progress</Text>
              <TouchableOpacity
                style={styles.addExerciseButton}
                onPress={() => setPickerVisible(true)}
              >
                <Text style={styles.addExerciseText}>Add Exercise</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Place the picker here so it overlays on top of everything */}
          <ExercisePicker
            isVisible={pickerVisible}
            onSelect={apiEx => {
              const minimal: Exercise = {
                id: apiEx.id,
                name: apiEx.name,
                setList: [{ id: '1', setNum: 1, weight: 0, reps: 0 }],
              };
              workoutCtx.addExercise(minimal);
              setPickerVisible(false);
            }}
            onClose={() => setPickerVisible(false)}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
