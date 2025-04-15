import { Exercise, Workout } from "@/types";
import { createContext, useContext, useRef, useState } from "react";

interface WorkoutContextType extends Workout {
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  startWorkout: () => void;
  stopWorkout: () => void;
  resetTimer: () => void;
  activeWorkout: boolean;
}

const initialWorkout: Workout = {
  id: Date.now().toString(),
  name: "Workout Test",
  exercises: [],
  date: new Date().toISOString(),
  timer: 0,
};

const WorkoutContext = createContext<WorkoutContextType>({
  ...initialWorkout,
  addExercise: () => {},
  removeExercise: () => {},
  startWorkout: () => {},
  stopWorkout: () => {},
  resetTimer: () => {},
  activeWorkout: false,
});

interface WorkoutProviderProps {
  children: React.ReactNode;
}

const WorkoutProvider: React.FC<WorkoutProviderProps> = ({ children }) => {
  const [workout, setWorkout] = useState<Workout>(initialWorkout);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  const addExercise = (exercise: Exercise) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: [...prevWorkout.exercises, exercise],
    }));
  };

  const removeExercise = (id: string) => {
    setWorkout((prevWorkout) => ({
      ...prevWorkout,
      exercises: prevWorkout.exercises.filter((exercise) => exercise.id !== id),
    }));
  };

  const startWorkout = () => {
    // Reset the timer and set a new start date if desired.
    setWorkout((prev) => ({ ...prev, timer: 0, date: new Date().toISOString() }));
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setWorkout((prevWorkout) => ({ ...prevWorkout, timer: prevWorkout.timer + 1 }));
      }, 1000);
    }
  };

  const stopWorkout = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null;
    }
    // Reset the workout to a fresh state by creating a new workout object.
    setWorkout({
      id: Date.now().toString(),
      name: "Workout Test",
      exercises: [],
      date: new Date().toISOString(),
      timer: 0,
    });
  };
  

  const resetTimer = () => {
    setWorkout((prevWorkout) => ({ ...prevWorkout, timer: 0 }));
  };

  const activeWorkout = timerInterval.current !== null;

  return (
    <WorkoutContext.Provider
      value={{
        ...workout,
        addExercise,
        removeExercise,
        startWorkout,
        stopWorkout,
        resetTimer,
        activeWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutProvider;

export const useWorkout = () => useContext(WorkoutContext);
