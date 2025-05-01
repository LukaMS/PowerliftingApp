// app/(user)/workout/index.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, FlatList, Modal, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { useWorkout } from '@/providers/WorkoutProvider';
import { Workout } from '@/types';
import ExerciseCardReadOnly from '@/components/ExerciseCardReadOnly';

export default function WorkoutScreen() {
  const router = useRouter();
  const { activeWorkout, loadProgram } = useWorkout();
  const [selected, setSelected] = useState<Workout | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {programs} = useWorkout();
  const startWorkout = () => {
    router.push('/(user)/workout/activeWorkout');
  };

  const onProgramPress = (prog: Workout) => {
    setSelected(prog);
    setModalVisible(true);
  };

  const startSelected = () => {
    if (!selected) return;
    loadProgram(selected);
    setModalVisible(false);
    router.push('/(user)/workout/activeWorkout');
  };
  const { resetPrograms } = useWorkout();



  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Workout</Text>
      <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
        <Text style={styles.buttonText}>{activeWorkout ? 'View Workout' : 'Start Workout'}</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Pick a Program</Text>
      <FlatList
        data={programs}
        keyExtractor={(p) => p.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.programCard}
            onPress={() =>
              onProgramPress({
                ...item,
                date: new Date().toISOString(),
                timer: 0,
              })
            }
          >
            <Text style={styles.programName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalBackground}>
          <SafeAreaView style={styles.modalContent}>
            <Text style={styles.modalHeader}>{selected?.name}</Text>
            <FlatList
              data={selected?.exercises}
              keyExtractor={(e) => e.id}
              renderItem={({ item }) => <ExerciseCardReadOnly exercise={item} />}
              contentContainerStyle={styles.list}
            />
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Start Workout" onPress={startSelected} />
            </View>
          </SafeAreaView>
        </SafeAreaView>
      </Modal>

      {activeWorkout && (
        <TouchableOpacity style={styles.miniBar} onPress={() => router.push('/(user)/workout/activeWorkout')}>
          <Text style={styles.miniText}>Continue Current Workout</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9', padding: 10 },
  header: { fontSize: 32, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subHeader: { fontSize: 28, fontWeight: 'bold', marginBottom: 12, padding: 12 },
  startButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  list: { paddingBottom: 20, padding:5 },
  programCard: {
    backgroundColor: '#fff', padding: 16, borderRadius: 8,
    marginBottom: 10, elevation: 2
  },
  programName: { fontSize: 18, fontWeight: '600' },

  modalBackground: {
    flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContent: {
    margin: 20, marginVertical:50, backgroundColor: '#fff', borderRadius: 10, padding: 20
  },
  modalHeader: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, padding: 10 },
  exerciseItem: { fontSize: 16, marginVertical: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },

  miniBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#007AFF', padding: 12, alignItems: 'center'
  },
  miniText: { color: '#fff', fontWeight: '600' },
});

