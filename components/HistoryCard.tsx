// HistoryCard.tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Workout } from '@/types';

interface HistoryCardProps {
  workout: Workout;
  onPress: () => void;
}

const HistoryCard: React.FC<HistoryCardProps> = ({ workout, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Text style={styles.workoutName}>{workout.name}</Text>
      <Text style={styles.workoutDate}>{workout.date}</Text>
    </TouchableOpacity>
  );
};

export default HistoryCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  workoutDate: {
    fontSize: 14,
    color: '#666',
  },
});
