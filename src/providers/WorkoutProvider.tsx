import { Exercise, Workout } from "@/types";
import { createContext, useContext, useRef, useState } from "react";

interface WorkoutContextType extends Workout {
  addExercise: (exercise: Exercise) => void;
  removeExercise: (id: string) => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  activeWorkout: boolean,
}

const WorkoutContext = createContext<WorkoutContextType>({
  exercises: [],
  timer: 0,
  addExercise: () => {},
  removeExercise: () => {},
  startTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  activeWorkout: false,
})


const WorkoutProvider = ({children}) => {
  const [exercises, setExercises] = useState([]);
  const [timer, setTimer] = useState(0);
  const timerInterval = useRef(null);

  const addExercise = (exercise) => {
    setExercises(prevExercises => [...prevExercises, exercise]);
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
  };

  const startTimer = () => {
    // Avoid multiple intervals
    if (!timerInterval.current) {
      timerInterval.current = setInterval(() => {
        setTimer(prevTime => prevTime + 1);
      }, 1000);
    }
  };

  // Function to stop the timer
  const stopTimer = () => {
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
      timerInterval.current = null; // Reset the reference so the timer can restart later.
    }
  };
  

  const resetTimer = () => {
    setTimer(0);
  };

  const activeWorkout = timer > 0;

  return(
    <WorkoutContext.Provider value={{exercises, timer, addExercise, removeExercise, startTimer, stopTimer, resetTimer, activeWorkout }}>
        {children}
    </WorkoutContext.Provider>
  )
}

export default WorkoutProvider;

export const useWorkout = () => useContext(WorkoutContext);