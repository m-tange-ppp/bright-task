import * as SQLite from "expo-sqlite";

const DB_NAME = "bright_task.db";

// Promise シングルトン: 並行呼び出しでも openDatabaseAsync は1回だけ実行される
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initSchema(): Promise<void> {
  const database = await getDatabase();
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS treats (
      id          TEXT PRIMARY KEY NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      cost_points INTEGER NOT NULL DEFAULT 1,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS point_history (
      id            TEXT PRIMARY KEY NOT NULL,
      task_id       TEXT,
      treat_id      TEXT,
      type          TEXT NOT NULL,
      change_points INTEGER NOT NULL,
      reason        TEXT NOT NULL,
      created_at    TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      dislike_level INTEGER NOT NULL DEFAULT 3,
      importance INTEGER NOT NULL DEFAULT 3,
      status TEXT NOT NULL DEFAULT 'pending',
      due_date TEXT,
      reminder_at TEXT,
      pre_reminder_offsets TEXT NOT NULL DEFAULT '[]',
      notification_ids TEXT NOT NULL DEFAULT '[]',
      has_time INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  // 既存 DB へのマイグレーション（列が存在しない場合のみ追加）
  // const migrations: [string, string][] = [
  //   [
  //     "pre_reminder_offsets",
  //     "ALTER TABLE tasks ADD COLUMN pre_reminder_offsets TEXT NOT NULL DEFAULT '[]'",
  //   ],
  //   [
  //     "notification_ids",
  //     "ALTER TABLE tasks ADD COLUMN notification_ids TEXT NOT NULL DEFAULT '[]'",
  //   ],
  //   [
  //     "has_time",
  //     "ALTER TABLE tasks ADD COLUMN has_time INTEGER NOT NULL DEFAULT 0",
  //   ],
  // ];
  // for (const [, sql] of migrations) {
  //   try {
  //     await database.execAsync(sql);
  //   } catch {
  //     // 列がすでに存在する場合は無視
  //   }
  // }
}
