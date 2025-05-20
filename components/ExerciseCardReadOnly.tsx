import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Exercise, Set } from '@/types';

interface ExerciseCardReadOnlyProps {
  exercise: Exercise;
}

const ExerciseCardReadOnly: React.FC<ExerciseCardReadOnlyProps> = ({ exercise }) => {
  // Use the exercise.setList if provided or create a default set.
  const sets: Set[] =
    exercise.setList && exercise.setList.length > 0
      ? exercise.setList
      : [{ id: '1', setNum: 1, weight: 0, reps: 0 }];

  return (
    <View style={styles.cardContainer}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      {/* Header Row */}
      <View style={styles.rowHeader}>
        <Text style={[styles.headerLabel, styles.setColumn]}>Set</Text>
        <Text style={[styles.headerLabel, styles.repsColumn]}>Reps</Text>
        <Text style={[styles.headerLabel, styles.weightColumn]}>Weight</Text>
      </View>
      {sets.map((set) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={[styles.rowText, styles.setColumn]}>{set.setNum}</Text>
          <TextInput
            style={[styles.input, styles.repsColumn]}
            keyboardType="numeric"
            placeholder="0"
            value={String(set.reps)}
            editable={false}
          />
          <TextInput
            style={[styles.input, styles.weightColumn]}
            keyboardType="numeric"
            placeholder="0"
            value={String(set.weight)}
            editable={false}
          />
        </View>
      ))}
    </View>
  );
};

export default ExerciseCardReadOnly;

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
});
