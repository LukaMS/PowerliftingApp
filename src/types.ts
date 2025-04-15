export type Exercise = {
    id: string;
    name: string;
    sets?: number;
    setList?: Set[]
};

export type Set = {
    id: string,
    setNum: number,
    weight: number,
    reps: number,
}

export type Workout = {
    exercises: Exercise[];
    timer: number;
  }