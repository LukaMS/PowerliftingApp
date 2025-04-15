import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Exercise } from '@/types';
import { useWorkout } from '@/providers/WorkoutProvider';

// Configure Expo Router to use a transparent modal with a fade animation.
export const unstable_settings = {
  presentation: 'transparentModal',
  animation: 'fade',
};

const exerciseOptions = [
  { id: '1', name: 'Push Ups', sets:1, setList: [] },
  { id: '2', name: 'Pull Ups', sets:1, setList: [] },
  { id: '3', name: 'Squats', sets:1, setList: [] },
  { id: '4', name: 'Bench Press', sets:1, setList: [] },
] as Exercise[];


const AddExerciseModal = () => {
  const router = useRouter();
    const { addExercise } = useWorkout();

  const handleSelectExercise = (exercise: Exercise) => {
    console.log('Selected exercise:', exercise);
    addExercise(exercise);
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <View style={styles.modalBackground}>
      <View style={styles.popupContainer}>
        <Text style={styles.header}>Select an Exercise</Text>
        
        <FlatList
          data={exerciseOptions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleSelectExercise(item)}
            >
              <Text style={styles.optionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
        />

        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddExerciseModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // no dark overlay
  },
  popupContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    // iOS shadow.
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Android elevation.
    elevation: 5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContent: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    color: 'red',
  },
});
