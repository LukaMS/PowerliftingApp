import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultPrograms from '@/assets/data/programs.json';
import { Exercise, Workout } from '@/types';

interface WorkoutContextType {
  // Current workout in progress
  id: string;
  name: string;
  exercises: Exercise[];
  date: string;
  timer: number;

  // Saved programs list
  programs: Workout[];
  addProgram: (program: Workout) => Promise<void>;

  // Workout control methods
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  updateExercise: (exercise: Exercise) => void;
  startWorkout: () => void;
  stopWorkout: () => void;
  resetTimer: () => void;
  activeWorkout: boolean;
  getWorkout: () => Workout;
  loadProgram: (program: Workout) => Promise<void>;
  resetPrograms: () => void;
}

const initialWorkout: Workout = {
  id: Date.now().toString(),
  name: 'Workout Test',
  exercises: [],
  date: new Date().toISOString(),
  timer: 0,
};

const WorkoutContext = createContext<WorkoutContextType>({
  ...initialWorkout,
  programs: [],
  addProgram: async () => {},
  addExercise: () => {},
  removeExercise: () => {},
  updateExercise: () => {},
  startWorkout: () => {},
  stopWorkout: () => {},
  resetTimer: () => {},
  activeWorkout: false,
  getWorkout: () => initialWorkout,
  loadProgram: async () => {},
  resetPrograms: async () => {},
});

interface WorkoutProviderProps {
  children: React.ReactNode;
}

const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  const [programs, setPrograms] = useState<Workout[]>([]);
  const timerInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load saved programs (or defaults) on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('programs');
        if (stored) {
          setPrograms(JSON.parse(stored));
        } else {
          setPrograms(
            defaultPrograms.map((program: any) => ({
              ...program,
              date: new Date().toISOString(),
              timer: 0,
            }))
          );
        }
      } catch (e) {
        console.error('Error loading programs:', e);
        setPrograms(
          defaultPrograms.map((program: any) => ({
            ...program,
            date: new Date().toISOString(),
            timer: 0,
          }))
        );
      }
    })();
  }, []);

  const getWorkout = () => workout;

  const addExercise = (exercise: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: [...prev.exercises, exercise],
    }));
  };

  const removeExercise = (id: string) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.filter(e => e.id !== id),
    }));
  };

  const updateExercise = (updated: Exercise) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(e => e.id === updated.id ? updated : e),
    }));
  };

  const startWorkout = () => {
    setWorkout(prev => ({ ...prev, timer: 0, date: new Date().toISOString() }));
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setWorkout(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
  };

  const stopWorkout = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    setWorkout(initialWorkout);
  };

  const resetTimer = () => {
    setWorkout(prev => ({ ...prev, timer: 0 }));
  };

  const activeWorkout = timerInterval.current !== null;

  const addProgram = async (program: Workout) => {
    const updated = [program, ...programs];
    setPrograms(updated);
    try {
      await AsyncStorage.setItem('programs', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving programs:', e);
    }
  };

  const loadProgram = async (program: Workout) => {
    // Persist it and then load as current workout
    const fresh = { ...program, date: new Date().toISOString(), timer: 0 };
    //await addProgram(fresh);
    setWorkout(fresh);
  };

  const resetPrograms = async () => {
    try {
      await AsyncStorage.removeItem('programs');
      const reloaded = defaultPrograms.map((p: any) => ({
        ...p,
        date: new Date().toISOString(),
        timer: 0,
      }));
      setPrograms(reloaded);
    } catch (e) {
      console.error('Failed to reset programs:', e);
    }
  };

  return (
    <WorkoutContext.Provider
      value={{
        ...workout,
        programs,
        addProgram,
        addExercise,
        removeExercise,
        updateExercise,
        startWorkout,
        stopWorkout,
        resetTimer,
        activeWorkout,
        getWorkout,
        loadProgram,
        resetPrograms,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutProvider;
export const useWorkout = () => useContext(WorkoutContext);
