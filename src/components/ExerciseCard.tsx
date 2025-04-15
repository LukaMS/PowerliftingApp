import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Animated, Alert } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Exercise, Set } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onDelete }) => {
  // Use the exercise.setList if provided or create a default set.
  const [sets, setSets] = useState<Set[]>(
    exercise.setList && exercise.setList.length > 0
      ? exercise.setList
      : [{ id: '1', setNum: 1, weight: 0, reps: 0 }]
  );

  // Add a new set with default values.
  const addSet = () => {
    const newSet: Set = {
      id: `${sets.length + 1}`,
      setNum: sets.length + 1,
      weight: 0,
      reps: 0,
    };
    setSets([...sets, newSet]);
  };

  // Update a particular set's details.
  const updateSet = (id: string, field: 'reps' | 'weight', value: number) => {
    setSets(prevSets =>
      prevSets.map(set =>
        set.id === id ? { ...set, [field]: value } : set
      )
    );
  };

  // Remove a set by id.
  const removeSet = (id: string) => {
    setSets(prevSets => prevSets.filter(set => set.id !== id));
  };

  // Confirmation popup for deleting the entire card.
  const handleDeleteCard = () => {
    Alert.alert(
      'Delete Exercise',
      'Are you sure you want to delete this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: onDelete }
      ],
      { cancelable: true }
    );
  };

  // Render the right action for the swipeable row.
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
    id: string
  ) => (
    <TouchableOpacity style={styles.deleteButton} onPress={() => removeSet(id)}>
      <Text style={styles.deleteButtonText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.cardContainer}>
      {/* Delete Button on Card Header */}
      {onDelete && (
        <TouchableOpacity style={styles.cardDeleteButton} onPress={handleDeleteCard}>
          <Text style={styles.cardDeleteButtonText}>X</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      {/* Header Row */}
      <View style={styles.rowHeader}>
        <Text style={[styles.headerLabel, styles.setColumn]}>Set</Text>
        <Text style={[styles.headerLabel, styles.repsColumn]}>Reps</Text>
        <Text style={[styles.headerLabel, styles.weightColumn]}>Weight</Text>
      </View>
      {sets.map((set, index) => (
        <Swipeable
          key={set.id}
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, set.id)
          }
        >
          <View style={styles.setRow}>
            <Text style={[styles.rowText, styles.setColumn]}>{set.setNum}</Text>
            <TextInput
              style={[styles.input, styles.repsColumn]}
              keyboardType="numeric"
              placeholder="0"
              value={String(set.reps)}
              onChangeText={(text) =>
                updateSet(set.id, 'reps', parseInt(text) || 0)
              }
            />
            <TextInput
              style={[styles.input, styles.weightColumn]}
              keyboardType="numeric"
              placeholder="0"
              value={String(set.weight)}
              onChangeText={(text) =>
                updateSet(set.id, 'weight', parseFloat(text) || 0)
              }
            />
          </View>
        </Swipeable>
      ))}
      <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
        <Text style={styles.addSetText}>+ Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ExerciseCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    position: 'relative',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardDeleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'red',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  cardDeleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  rowHeader: {
    flexDirection: 'row',
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  headerLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  setColumn: {
    flex: 0.5,
    textAlign: 'center',
  },
  repsColumn: {
    flex: 1,
    textAlign: 'center',
  },
  weightColumn: {
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    marginBottom: 10,
  },
  rowText: {
    fontSize: 16,
    marginHorizontal: 5,
  },
  input: {
    height: 35,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 5,
    flex: 1,
    backgroundColor: '#fff',
  },
  addSetButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  addSetText: {
    color: '#fff',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 45,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
