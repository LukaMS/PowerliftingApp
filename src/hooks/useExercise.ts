// src/hooks/useExercises.ts
import { useState, useEffect } from 'react';
import { initDB, queryDB } from '../db';

export function useExercises(
  filter: { bodyPart?: string; search?: string } = {},
  page = 0,
  perPage = 20
) {
  const [data, setData] = useState<any[]>([]);
  const [ready, setReady] = useState(false);

  // 1) initialize/seeding happens once
  useEffect(() => {
    initDB()
      .then(() => setReady(true))
      .catch((e) => console.error('DB init failed:', e));
  }, []);

  // 2) whenever ready + filters change, run your SELECT
  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    (async () => {
      let sql = `SELECT * FROM exercises`;
      const clauses: string[] = [];
      const args: any[] = [];

      if (filter.bodyPart) {
        clauses.push(`bodyPart = ?`);
        args.push(filter.bodyPart);
      }
      if (filter.search) {
        clauses.push(`name LIKE ? COLLATE NOCASE`);
        args.push(`%${filter.search}%`);
      }
      if (clauses.length) {
        sql += ' WHERE ' + clauses.join(' AND ');
      }
      sql += ` LIMIT ? OFFSET ?`;
      args.push(perPage, page * perPage);

      try {
        const rows = await queryDB(sql, args);
        if (!cancelled) {
          setData(rows);
        }
      } catch (e) {
        console.error('Query failed:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [ready, filter.bodyPart, filter.search, page, perPage]);

  return data;
}
