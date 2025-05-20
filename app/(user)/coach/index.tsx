import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, TextInput, Button, Pressable, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { askCoach } from '@/api/coach';
import exercisesData from 'assets/new-exercises.json';
import ExerciseCardReadOnly from '@/components/ExerciseCardReadOnly';
import { useWorkout } from '@/providers/WorkoutProvider';
import type { GeneratedProgram } from '@/api/coach';
import { useRouter } from 'expo-router';

export default function CoachScreen() {
    const router = useRouter();
    const [modalVisible, setModalVisible] = useState(false);
    const [inputType, setInputType] = useState<'generate' | 'ask' | null>(null);
    const [inputText, setInputText] = useState('');
    const [coachResponse, setCoachResponse] = useState<string | any>(null);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { addProgram } = useWorkout();

    const openModal = (type: 'generate' | 'ask') => {
        setInputType(type);
        setModalVisible(true);
    };

    const handleSubmit = async () => {
        setModalVisible(false);
        setLoading(true);
        // build exercise list for generation
        const exercisesList = exercisesData.map(ex => ({ id: ex.id, name: ex.name }));
        let response;
        try {
            if (inputType === 'generate') {
                response = await askCoach('generate', inputText, exercisesList);
            } else {
                response = await askCoach('ask', inputText);
            }
            console.log('Coach response:', response);
            setCoachResponse(response);
            // if generated program, open result modal
            if (typeof response === 'object') {
                setResultModalVisible(true);
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
        setInputText('');
        setInputType(null);
    };

    const handleSaveProgram = async () => {
        const generated = coachResponse as GeneratedProgram;
        await addProgram({
            ...generated,
            date: new Date().toISOString(),
            timer: 0,
        });
        setResultModalVisible(false);
        setCoachResponse(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>We are thinking...</Text>
                </View>
            )}

            <Text style={styles.header}>Coach</Text>
            {/* Blurb displayed only before any response */}
            {!coachResponse && !loading && !modalVisible && (
                <Text style={styles.blurb}>
                    Welcome to your AI Coach! Describe a workout goal or ask a fitness question below to get started.
                </Text>
            )}
            <Pressable style={styles.button} onPress={() => openModal('generate')}>
                <Text style={styles.buttonText}>Generate Workout</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => openModal('ask')}>
                <Text style={styles.buttonText}>Ask Questions</Text>
            </Pressable>

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalHeader}>
                            {inputType === 'generate'
                                ? 'Describe Your Desired Workout'
                                : 'Ask a Question'}
                        </Text>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder={
                                inputType === 'generate'
                                    ? 'e.g. upper body focus for 45 minutes'
                                    : 'e.g. What is proper squat form?'
                            }
                            value={inputText}
                            onChangeText={setInputText}
                        />
                        <View style={styles.modalButtons}>
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false);
                                    setInputText('');
                                }}
                            />
                            <Button title="Submit" onPress={handleSubmit} />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Display plain text answers */}
            {coachResponse && typeof coachResponse === 'string' && !loading && (
                <ScrollView style={styles.answerContainer}>
                    <Markdown style={{ body: styles.answerText }}>
                        {coachResponse}
                    </Markdown>
                </ScrollView>
            )}

            {/* Generated workout modal */}
            <Modal visible={resultModalVisible} animationType="slide">
                <SafeAreaView style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Your Generated Workout</Text>
                    <ScrollView style={styles.scroll}>
                        {/* Only map exercises if response object has exercises */}
                        {((coachResponse as GeneratedProgram)?.exercises ?? []).map(ex => (
                            <ExerciseCardReadOnly
                                key={ex.id}
                                exercise={ex}
                            />
                        ))}
                    </ScrollView>
                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={() => setResultModalVisible(false)} />
                        <Button title="Save Program" onPress={handleSaveProgram} />
                    </View>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 15,
    },
    blurb: { 
        fontSize: 20, 
        color: '#555', 
        marginHorizontal: 15, 
        marginBottom: 30 
    },
    header: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
        padding: 20
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    modalHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        marginBottom: 15,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    answerContainer: {
        margin: 20,
        padding: 15,
        backgroundColor: '#eeef',
        borderRadius: 8,
    },
    answerText: {
        fontSize: 16,
        color: '#333',
    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 1,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#007AFF',
    },
    modalContainer: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f9f9f9',
    },
    scroll: {
        flex: 1,
        marginVertical: 10,
    },
});