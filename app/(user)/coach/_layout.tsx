import { Link, Stack } from "expo-router";

export default function CoachStack(){
    return (
    <Stack>
        <Stack.Screen 
            name="index"
            options={{ title: 'Coach', headerShown: false }}
        />
    </Stack>
    )
}