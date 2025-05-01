import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Alert, Keyboard, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Exercise, Set } from '@/types';

// Extract SetRowItem outside main component
interface SetRowItemProps {
  set: Set;
  onUpdate: (id: string, field: 'reps' | 'weight', value: number) => void;
  onRemove: (id: string) => void;
}
const SetRowItem: React.FC<SetRowItemProps> = ({ set, onUpdate, onRemove }) => {
  const [repsText, setRepsText] = useState(set.reps > 0 ? String(set.reps) : '');
  const [weightText, setWeightText] = useState(set.weight > 0 ? String(set.weight) : '');

  useEffect(() => setRepsText(set.reps > 0 ? String(set.reps) : ''), [set.reps]);
  useEffect(() => setWeightText(set.weight > 0 ? String(set.weight) : ''), [set.weight]);

  return (
    <Swipeable
      renderRightActions={(progress, dragX) => (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onRemove(set.id)}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <View style={styles.setRow}>
        <Text style={[styles.rowText, styles.setColumn]}>{set.setNum}</Text>
        <TextInput
          style={[styles.input, styles.repsColumn]}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#444"
          value={repsText}
          onChangeText={setRepsText}
          onBlur={() => onUpdate(set.id, 'reps', parseInt(repsText) || 0)}
        />
        <TextInput
          style={[styles.input, styles.weightColumn]}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#444"
          value={weightText}
          onChangeText={setWeightText}
          onBlur={() => onUpdate(set.id, 'weight', parseFloat(weightText) || 0)}
        />
      </View>
    </Swipeable>
  );
};

interface ExerciseCardProps {
  exercise: Exercise;
  onDelete?: () => void;
  onUpdate: (exercise: Exercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onDelete, onUpdate }) => {
  const sets = exercise.setList || [];

  // Add a new empty set
  const addSet = () => {
    const newSet: Set = {
      id: `${sets.length + 1}`,
      setNum: sets.length + 1,
      weight: 0,
      reps: 0,
    };
    onUpdate({ ...exercise, setList: [...sets, newSet] });
  };

  // Update a field in a set
  const updateSet = (id: string, field: 'reps' | 'weight', value: number) => {
    const updatedSets = sets.map((s) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    onUpdate({ ...exercise, setList: updatedSets });
  };

  // Remove a set and re-index
  const removeSet = (id: string) => {
    const filtered = sets.filter((s) => s.id !== id);
    onUpdate({
      ...exercise,
      setList: filtered.map((s, i) => ({ ...s, setNum: i + 1 })),
    });
  };

  // Delete entire exercise card confirmation
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.cardContainer}>
        {onDelete && (
          <TouchableOpacity style={styles.cardDeleteButton} onPress={handleDeleteCard}>
            <Text style={styles.cardDeleteButtonText}>X</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.exerciseName}>{exercise.name}</Text>
        <View style={styles.rowHeader}>
          <Text style={[styles.headerLabel, styles.setColumn]}>Set</Text>
          <Text style={[styles.headerLabel, styles.repsColumn]}>Reps</Text>
          <Text style={[styles.headerLabel, styles.weightColumn]}>Weight</Text>
        </View>
        {sets.map((s) => (
          <SetRowItem
            key={s.id}
            set={s}
            onUpdate={updateSet}
            onRemove={removeSet}
          />
        ))}
        <TouchableOpacity style={styles.addSetButton} onPress={addSet}>
          <Text style={styles.addSetText}>+ Add Set</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
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
  cardDeleteButtonText: { color: '#fff', fontWeight: 'bold' },
  exerciseName: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  rowHeader: { flexDirection: 'row', marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 5 },
  headerLabel: { fontSize: 16, fontWeight: '600' },
  setColumn: { flex: 0.5, textAlign: 'center' },
  repsColumn: { flex: 1, textAlign: 'center' },
  weightColumn: { flex: 1, textAlign: 'center' },
  setRow: { flexDirection: 'row', alignItems: 'center', height: 45, marginBottom: 10 },
  rowText: { fontSize: 16, marginHorizontal: 5 },
  input: { height: 35, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, paddingHorizontal: 5, fontSize: 16, textAlign: 'center', marginHorizontal: 5, flex: 1, backgroundColor: '#fff' },
  addSetButton: { marginTop: 10, paddingVertical: 5, paddingHorizontal: 10, alignSelf: 'center', backgroundColor: '#007AFF', borderRadius: 5 },
  addSetText: { color: '#fff', fontSize: 16 },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 60, height: 35, marginTop: 5, borderRadius: 5 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});
