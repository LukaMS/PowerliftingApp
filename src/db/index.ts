import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import newExercises from '@assets/new-exercises.json';
/**
 * Type definition for an exercise record.
 */
export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string;
  secondaryMuscles: string[];      // new!
};

const DB_NAME = 'exercises.db';
let db: SQLite.SQLiteDatabase;

/**
 * Initialize the local SQLite database:
 * - Open or create the database file
 * - Create the exercises table if it doesn't exist
 * - Seed the table from bundled JSON on first launch
 */
export async function initDB(): Promise<void> {
  db = await SQLite.openDatabaseAsync(DB_NAME);

  // map JSON → typed objects
  const exercises: Exercise[] = (newExercises as any[]).map(ex => ({
    id:           ex.id,
    name:         ex.name,
    bodyPart:     ex.bodyPart      || '',
    target:       ex.target        || '',
    equipment:    ex.equipment     || '',
    gifUrl:       ex.gifUrl,
    instructions: Array.isArray(ex.instructions)
                     ? ex.instructions.join('\n')
                     : (ex.instructions || ''),
    secondaryMuscles: Array.isArray(ex.secondaryMuscles)
                     ? ex.secondaryMuscles
                     : []
  }));

  await db.withTransactionAsync(async () => {
    // create table if it doesn't exist
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT,
        bodyPart TEXT,
        target TEXT,
        equipment TEXT,
        gifUrl TEXT,
        instructions TEXT,
        secondaryMuscles TEXT
      );
    `);

    // only seed on first launch when table is empty
    const rows = await db.getAllAsync<{ count: number }>(
      `SELECT COUNT(*) AS count FROM exercises;`
    );
    if (rows[0].count === 0) {
      for (const ex of exercises) {
        await db.runAsync(
          `INSERT INTO exercises
             (id, name, bodyPart, target, equipment, gifUrl, instructions, secondaryMuscles)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          ex.id,
          ex.name,
          ex.bodyPart,
          ex.target,
          ex.equipment,
          ex.gifUrl,
          ex.instructions,
          ex.secondaryMuscles.join(',')
        );
      }
    }
  });
}


/**
 * Execute a read-only SQL query and return all rows as typed objects.
 */
export async function queryDB<T = any>(
  sql: string,
  params: SQLite.SQLiteBindValue[] = []
): Promise<T[]> {
  const rows = await db.getAllAsync<T>(sql, params as any);
  return rows;
}

/**
 * Execute a read-only SQL query and return the first matching row (or null).
 */
export async function getOne<T = any>(
  sql: string,
  params: SQLite.SQLiteBindValue[] = []
): Promise<T | null> {
  const all = await queryDB<T>(sql, params);
  return all.length > 0 ? all[0] : null;
}
