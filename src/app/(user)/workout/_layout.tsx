import { Stack } from 'expo-router';

export default function WorkoutStack() {
  return (
    <Stack>
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }} 
      />
      {/* The main active workout screen */}
      <Stack.Screen 
        name="activeWorkout"
        options={{
          title: 'Workout',
          headerShown: false,
          presentation: 'modal', // Active workout can cover the full screen.
        }} 
      />

      {/* The add exercise pop-up screen */}
      <Stack.Screen 
        name="addExercise"
        options={{
          title: 'Add Exercise',
          headerShown: false,
          presentation: 'transparentModal', // Use a transparent modal for the pop-up.
          animation: 'fade', // Fade in animation.
        }} 
      />
    </Stack>
  );
}
