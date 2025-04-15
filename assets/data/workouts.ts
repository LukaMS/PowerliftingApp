import { Workout } from "@/types";

export const dummyWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Leg Day Workout',
    date: '2025-04-10',
    timer: 1800,
    exercises: [
      {
        id: 'ex1',
        name: 'Squats',
        setList: [
          { id: '1', setNum: 1, weight: 100, reps: 8 },
          { id: '2', setNum: 2, weight: 100, reps: 8 },
        ],
      },
      {
        id: 'ex2',
        name: 'Lunges',
        setList: [
          { id: '1', setNum: 1, weight: 100, reps: 8 },
          { id: '2', setNum: 2, weight: 100, reps: 8 },
        ],
      },
      {
        id: 'ex3',
        name: 'Calf Raises',
        setList: [
          { id: '1', setNum: 1, weight: 100, reps: 8 },
          { id: '2', setNum: 2, weight: 100, reps: 8 },
        ],
      },
      {
        id: 'ex4',
        name: 'Leg Extensions',
        setList: [
          { id: '1', setNum: 1, weight: 100, reps: 8 },
          { id: '2', setNum: 2, weight: 100, reps: 8 },
        ],
      },
      // …other exercises
    ],
  },
  {
    id: '2',
    name: 'Chest and Triceps',
    date: '2025-04-08',
    timer: 3200,
    exercises: [
      {
        id: 'ex2',
        name: 'Bench Press',
        setList: [
          { id: '1', setNum: 1, weight: 80, reps: 10 },
          { id: '2', setNum: 2, weight: 80, reps: 10 },
        ],
      },
      // …other exercises
    ],
  },
  ];