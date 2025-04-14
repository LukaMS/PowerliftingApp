import { FontAwesome } from "@expo/vector-icons";
import { Link, Stack } from "expo-router";
import { Pressable } from "react-native";

export default function WorkoutStack(){
    return (
    <Stack>
        <Stack.Screen 
            name="index"
            options={{ title: 'Workout' }}
        />
    </Stack>
    )
}