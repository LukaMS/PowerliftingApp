import { Link, Stack } from "expo-router";

export default function HistoryStack(){
    return (
    <Stack>
        <Stack.Screen 
            name="index"
            options={{ title: 'History', headerShown: false }}
        />
        <Stack.Screen 
            name="workoutDetail"
            options={{ title: 'Detail', headerShown: false }}
        />
    </Stack>
    )
}