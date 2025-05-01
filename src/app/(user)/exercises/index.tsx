import React, { useState } from 'react';
import { View, TextInput, FlatList, StyleSheet } from 'react-native';
import { useExercises } from '@/hooks/useExercise';
import { ExerciseDetailsCard } from '@/components/ExerciseDetailsCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const ExerciseScreen = () => {
  const [search, setSearch] = useState('');
  const exercises = useExercises(
    search.trim().length > 0 ? { search } : {},
    0,
    2000
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search exercises…"
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#999"
      />
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseDetailsCard exercise={item} />
        )}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default ExerciseScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  search: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
});