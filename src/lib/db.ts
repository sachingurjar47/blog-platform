import fs from "fs";
import path from "path";

export type User = {
  id: string;
  email: string;
  password: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  likes: number;
  likedBy: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

type DB = { users: User[]; posts: Post[] };

const DATA_FILE = path.join(process.cwd(), "src", "data", "data.json");

function ensureDBFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify({ users: [], posts: [] }, null, 2),
      "utf8"
    );
  }
}

function readDB(): DB {
  ensureDBFile();
  const raw = fs.readFileSync(DATA_FILE, "utf8");
  try {
    return JSON.parse(raw) as DB;
  } catch (err) {
    // If json parse fails, re-create file
    const fallback: DB = { users: [], posts: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fallback, null, 2), "utf8");
    return fallback;
  }
}

function writeDB(db: DB) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), "utf8");
}

export function getDB(): DB {
  const db = readDB();
  return db;
}

export function saveDB(db: DB) {
  writeDB(db);
}
