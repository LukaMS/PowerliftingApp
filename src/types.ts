export type Exercise = {
    id: string;
    name: string;
    sets?: number;
    setList?: Set[];
};

export type Set = {
    id: string,
    setNum: number,
    weight: number,
    reps: number,
}

export type Workout = {
    id: string;
    name: string;
    exercises: Exercise[];
    date: string;
    timer: number;
  }

  export type Profile = {
    id: string;
    group: string;
  };