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

// In-memory database for both development and production
let memoryDB: DB = { users: [], posts: [] };
let isInitialized = false;

// Check if we're in production/serverless environment
function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
}

// Initialize database with default data
function initializeDB() {
  if (!isInitialized) {
    // Default data structure - clean start
    memoryDB = {
      users: [
        {
          id: "4510b83a-21cf-427e-90e8-1db6904f3ec2",
          email: "admin@example.com",
          password: "admin123",
          name: "Admin User",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      posts: [],
    };

    isInitialized = true;

    const env = isProduction() ? "production" : "development";
    console.log(
      `🗄️ Database initialized in ${env} mode (in-memory, clean start)`
    );
  }
}

export async function getDB(): Promise<DB> {
  initializeDB();
  return memoryDB;
}

export async function saveDB(db: DB): Promise<void> {
  initializeDB();
  memoryDB = { ...db };

  const env = isProduction() ? "production" : "development";
  console.log(`💾 Data saved in ${env} mode (in-memory)`);
}
