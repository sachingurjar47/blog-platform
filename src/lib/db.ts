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
  content: string | unknown;
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
  } catch {
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

  // Migration: Add missing fields to existing posts
  const migratedPosts = db.posts.map((post) => {
    if (
      !post.createdBy ||
      !post.createdAt ||
      !post.updatedAt ||
      !post.likedBy
    ) {
      return {
        ...post,
        createdBy: post.createdBy || "046b94b7-e5fa-4394-8697-db6c63de5677", // Default to first user
        createdAt: post.createdAt || new Date().toISOString(),
        updatedAt: post.updatedAt || new Date().toISOString(),
        likedBy: post.likedBy || [],
      };
    }
    return post;
  });

  // Only save if migration was needed
  if (migratedPosts.some((post, index) => post !== db.posts[index])) {
    db.posts = migratedPosts;
    saveDB(db);
  }

  return db;
}

export function saveDB(db: DB) {
  writeDB(db);
}
