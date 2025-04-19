import * as SQLite from 'expo-sqlite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import exercisesData from '@assets/exercises.json';
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
  videoUrl: string;
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
  // 1) Open (or create) the database
  db = await SQLite.openDatabaseAsync(DB_NAME);
  // Map the loaded JSON to match the Exercise type
  const exercises: Exercise[] = (exercisesData.data.exercises as any[]).map((ex) => ({
    id: ex.exerciseId,
    name: ex.name,
    bodyPart: ex.bodyParts?.[0] || '',
    target: ex.targetMuscles?.[0] || '',
    equipment: ex.equipments?.[0] || '',
    gifUrl: ex.gifUrl,
    instructions: Array.isArray(ex.instructions) ? ex.instructions.join('\n') : (ex.instructions || ''),
    videoUrl: ex.videoUrl || ''
  }));

  // 3) Run schema creation and seeding in one transaction
  await db.withTransactionAsync(async () => {
    // Create table if missing
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS exercises (
        id TEXT PRIMARY KEY,
        name TEXT,
        bodyPart TEXT,
        target TEXT,
        equipment TEXT,
        gifUrl TEXT,
        instructions TEXT,
        videoUrl TEXT
      );
    `);

    // Check if table is empty
    const countRows = await db.getAllAsync<{ cnt: number }>('SELECT COUNT(*) AS cnt FROM exercises;');
    const count = countRows[0]?.cnt ?? 0;

    // If empty, insert all records
    if (count === 0) {
      for (const ex of exercises) {
        await db.runAsync(
          `INSERT OR IGNORE INTO exercises
            (id, name, bodyPart, target, equipment, gifUrl, instructions, videoUrl)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
          ex.id,
          ex.name,
          ex.bodyPart,
          ex.target,
          ex.equipment,
          ex.gifUrl,
          ex.instructions || '',
          ex.videoUrl || ''
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
