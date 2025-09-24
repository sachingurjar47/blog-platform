import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { getDB, saveDB } from "../../lib/db";
import { signToken } from "../../lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const db = getDB();
  const exists = db.users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ message: "User already exists" });

  const now = new Date().toISOString();
  const newUser = {
    id: uuidv4(),
    email,
    password,
    name: email.split("@")[0],
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(newUser);
  saveDB(db);

  const token = signToken({ id: newUser.id, email: newUser.email });
  res.status(201).json({ token });
}
