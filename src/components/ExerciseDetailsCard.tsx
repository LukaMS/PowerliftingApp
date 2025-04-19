// src/components/ExerciseCard.tsx
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

export function ExerciseDetailsCard({ exercise }: { exercise: any }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => setOpen(true)}>
        <Image source={{ uri: exercise.gifUrl }} style={styles.thumb}/>
        <Text style={styles.title}>{exercise.name}</Text>
      </TouchableOpacity>

      <Modal visible={open} onRequestClose={() => setOpen(false)}>
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
  video: { width: 300, height: 200, borderRadius: 8 }
});
