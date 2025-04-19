// src/components/ExercisePicker.tsx
import { useExercises } from '@/hooks/useExercise';
import React, { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

export function ExercisePicker({
  isVisible,
  onSelect,
  onClose
}: {
  isVisible: boolean;
  onSelect: (ex: any) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  // If search is empty, show all exercises; otherwise, filter by search
  const exercises = useExercises(
    search.trim().length > 0 ? { search } : {},
    0,
    50
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.3}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Select an Exercise</Text>
        <TextInput
          placeholder="Search exercises…"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
        <FlatList
          data={exercises}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.row} onPress={() => onSelect(item)}>
              <Image source={{ uri: item.gifUrl }} style={styles.thumb}/>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: { justifyContent: 'center', margin: 0 },
  container: { backgroundColor: 'white', margin: 20, borderRadius: 8, padding: 16, maxHeight: '80%' },
  search: { borderBottomWidth: 1, marginBottom: 8, padding: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  thumb: { width: 60, height: 60, marginRight: 12, borderRadius: 4 },
  name: { fontSize: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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