import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import { getDB, saveDB } from "../../lib/db";
import { signToken } from "../../lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password, name } = req.body || {};

  // Validation errors object
  const errors: { [key: string]: string } = {};

  // Validate required fields
  if (!name || name.trim().length === 0) {
    errors.name = "Name is required";
  } else if (name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  }

  if (!email || email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long";
  } else if (password.length > 100) {
    errors.password = "Password must be less than 100 characters";
  }

  // Return validation errors if any
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  const db = getDB();
  const exists = db.users.find((u) => u.email === email);
  if (exists) return res.status(409).json({ message: "User already exists" });

  const now = new Date().toISOString();
  const newUser = {
    id: uuidv4(),
    email,
    password,
    name: name || email.split("@")[0], // Use provided name or fallback to email prefix
    createdAt: now,
    updatedAt: now,
  };
  db.users.push(newUser);
  saveDB(db);

  const token = signToken({ id: newUser.id, email: newUser.email });
  res.status(201).json({ token });
}
