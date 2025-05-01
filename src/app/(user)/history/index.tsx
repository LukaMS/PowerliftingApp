import React from "react";
import HistoryCard from "@/components/HistoryCard";
import { Workout } from "@/types";
import { useNavigation } from "expo-router";
import { FlatList, View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from '@/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkouts } from '@/api/profile';

const HistoryPage = () => {
    const navigation = useNavigation<any>();
    const { session, loading: authLoading } = useAuth();
    const userId = session?.user.id || '';
    const { data: workoutData, isLoading: workoutsLoading, error: workoutsError } = useQuery({
      queryKey: ['workouts', userId],
      queryFn: () => fetchWorkouts(userId),
      enabled: !!userId,
    });

    if (authLoading || workoutsLoading) {
      return <ActivityIndicator style={styles.loader} size="large" />;
    }
    if (workoutsError) {
      return (
        <SafeAreaView style={styles.container}>
          <Text>Error loading workouts</Text>
        </SafeAreaView>
      );
    }

    const renderItem = ({ item }: { item: Workout }) => (
      <HistoryCard
        workout={item}
        onPress={() =>
          navigation.navigate('workoutDetails', { workout: item })
        }
      />
    );
  
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={workoutData || []}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      </SafeAreaView>
    );
  };
  
  export default HistoryPage;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 15,
      backgroundColor: '#f2f2f2',
    },
    loader: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });