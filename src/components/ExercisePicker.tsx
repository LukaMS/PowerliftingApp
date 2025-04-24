// src/components/ExercisePicker.tsx
import { useExercises } from '@/hooks/useExercise';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';

export function ExercisePicker({
  isVisible,
  onSelect,
  onClose,
}: {
  isVisible: boolean;
  onSelect: (ex: any) => void;
  onClose: () => void;
}) {
  const [search, setSearch] = useState('');
  const exercises = useExercises(
    search.trim().length > 0 ? { search } : {},
    0,
    100
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      backdropOpacity={0.3}
      useNativeDriver
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
      animationOutTiming={300}
      animationIn="fadeIn"
      animationOut="fadeOut"
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Select an Exercise</Text>

        <TextInput
          placeholder="Search exercises…"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          placeholderTextColor="#999"
        />

        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              activeOpacity={0.7}
              onPress={() => onSelect(item)}
            >
              <Image source={{ uri: item.gifUrl }} style={styles.thumb} />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={onClose}
        >
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  container: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    width: '90%',
    // subtle shadow on iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // elevation on Android
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  search: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingVertical: Platform.select({ ios: 12, android: 8 }),
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 8,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    // thin divider
    borderWidth: 1,
    borderColor: '#ececec',
  },
  thumb: {
    width: 50,
    height: 50,
    marginRight: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
  },
  name: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  closeButton: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  closeText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});
