import { supabase } from '../lib/supabase';
import { Workout } from '@/types';

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function fetchWorkoutCount(userId: string) {
  const { count, error } = await supabase
    .from('workouts')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  if (error) throw error;
  return count || 0;
}

/**
 * Save a workout and its exercises and sets to Supabase
 */
export async function saveWorkout(workout: Workout, userId: string): Promise<void> {
  // 1) create the workout and let Postgres assign id
  const { data: workoutData, error: workoutError } = await supabase
    .from('workouts')
    .insert({
      name: workout.name,
      duration: workout.timer,
      user_id: userId,        
    })
    .select('id')             
    .single();
  if (workoutError) throw workoutError;
  const newWorkoutId = workoutData.id;  

  for (const exercise of workout.exercises) {
    const numSets = exercise.setList?.length ?? 0;
    const { data: exData, error: exErr } = await supabase
      .from('exercises')
      .insert({
        name: exercise.name,
        num_sets: numSets,
        workout_id: newWorkoutId
      })
      .select('id')
      .single();
    if (exErr) throw exErr;
    const newExerciseId = exData.id;

    if (exercise.setList) {
      for (const set of exercise.setList) {
        const { error: setErr } = await supabase
          .from('sets')
          .insert({
            setNum: set.setNum,
            weight:   set.weight,
            reps:     set.reps,
            exercise_id: newExerciseId
          });
        if (setErr) throw setErr;
      }
    }
  }
}

/**
 * Fetch all workouts for a user
 */
export async function fetchWorkouts(userId: string): Promise<Workout[]> {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(w => ({
    id: w.id,
    name: w.name,
    exercises: [], // details loaded in workout details page
    date: new Date(w.created_at).toLocaleDateString(),
    timer: w.duration,
  }));
}

/**
 * Fetch a workout with all its exercises and sets
 */
export async function fetchWorkoutDetails(workoutId: string): Promise<Workout> {
  // get workout record
  const { data: w, error: wErr } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single();
  if (wErr) throw wErr;

  // get exercises with nested sets
  const { data: exs, error: exErr } = await supabase
    .from('exercises')
    .select('id, name, sets(id, setNum, weight, reps)')
    .eq('workout_id', workoutId);
  if (exErr) throw exErr;

  return {
    id: w.id,
    name: w.name,
    date: new Date(w.created_at).toLocaleDateString(),
    timer: w.duration,
    exercises: exs.map(exercise => ({
      id: exercise.id,
      name: exercise.name,
      setList: exercise.sets.map(set => ({ id: set.id, setNum: set.setNum, weight: set.weight, reps: set.reps }))
    })),
  };
}