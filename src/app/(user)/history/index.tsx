import HistoryCard from "@/components/HistoryCard";
import { Workout } from "@/types";
import { dummyWorkouts } from "@assets/data/workouts";
import { useNavigation } from "expo-router";
import React from "react";
import { FlatList, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HistoryPage = () => {
    const navigation = useNavigation<any>();
    const workoutData = dummyWorkouts;

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
          data={workoutData}
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
  });