import { Workout } from "@/types";

export const dummyWorkouts: Workout[] = [
    {
      timer: 1800, // workout timer in seconds (e.g. 30 minutes)
      exercises: [
        {
          id: 'exercise-1',
          name: 'Push Ups',
          sets: 3,
          setList: [
            { id: 'set-1', setNum: 1, weight: 30, reps: 15 },
            { id: 'set-2', setNum: 2, weight: 35, reps: 12 },
            { id: 'set-3', setNum: 3, weight: 30, reps: 10 },
          ],
        },
        {
          id: 'exercise-2',
          name: 'Pull Ups',
          sets: 3,
          setList: [
            { id: 'set-1', setNum: 1, weight: 180, reps: 8 },
            { id: 'set-2', setNum: 2, weight: 200, reps: 6 },
            { id: 'set-3', setNum: 3, weight: 210, reps: 5 },
          ],
        },
      ],
    },
    {
      timer: 2400, // workout timer in seconds (e.g. 40 minutes)
      exercises: [
        {
          id: 'exercise-3',
          name: 'Squats',
          sets: 4,
          setList: [
            { id: 'set-1', setNum: 1, weight: 100, reps: 10 },
            { id: 'set-2', setNum: 2, weight: 100, reps: 10 },
            { id: 'set-3', setNum: 3, weight: 100, reps: 10 },
            { id: 'set-4', setNum: 4, weight: 100, reps: 10 },
          ],
        },
        {
          id: 'exercise-4',
          name: 'Bench Press',
          sets: 3,
          setList: [
            { id: 'set-1', setNum: 1, weight: 80, reps: 8 },
            { id: 'set-2', setNum: 2, weight: 80, reps: 8 },
            { id: 'set-3', setNum: 3, weight: 80, reps: 8 },
          ],
        },
      ],
    },
  ];