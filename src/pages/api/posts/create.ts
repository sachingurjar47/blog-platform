import type { NextApiRequest, NextApiResponse } from "next";
import { getDB, saveDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1] || req.cookies?.token;
  const decoded = token && verifyToken(token as string);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  const { title, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ message: "Missing title or content" });
  }

  const db = getDB();
  const now = new Date().toISOString();
  const newPost = {
    id: uuidv4(),
    title,
    content,
    likes: 0,
    likedBy: [],
    createdBy: (decoded as { id: string }).id,
    createdAt: now,
    updatedAt: now,
  };

  db.posts.push(newPost);
  saveDB(db);

  res.status(201).json(newPost);
}
