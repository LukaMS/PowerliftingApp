// src/components/ExerciseCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';

export function ExerciseDetailsCard({ exercise }: { exercise: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setOpen(true)}>
        <Image source={{ uri: exercise.gifUrl }} style={styles.thumb}/>
        <Text style={styles.title}>{exercise.name}</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <SafeAreaView style={styles.modalWrapper}>
          <TouchableWithoutFeedback onPress={() => setOpen(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.detail}>
              <Text style={styles.title}>{exercise.name}</Text>
              <Image source={{ uri: exercise.gifUrl }} style={styles.bigImage} />
              <Text style={styles.instructions}>{exercise.instructions}</Text>
              {exercise.videoUrl ? (
                <Video
                  source={{ uri: exercise.videoUrl }}
                  useNativeControls
                  style={styles.video}
                  resizeMode={"contain" as ResizeMode}
                />
              ) : null}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  thumb: { width: 80, height: 80, borderRadius: 6, marginRight: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  detail: { padding: 16, alignItems: 'center' },
  bigImage: { width: 300, height: 300, borderRadius: 8, marginVertical: 16 },
  instructions: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  video: { width: 275, height: 150, borderRadius: 8 },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalWrapper: { flex: 1, paddingTop:20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 16, margin: 32, alignItems: 'center' },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: { fontSize: 20, fontWeight: 'bold', color: '#fff' }
});
