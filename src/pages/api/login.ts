import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../lib/db";
import { signToken } from "../../lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  console.log("Login API received:", { email, password, body: req.body });

  // Validation errors object
  const errors: { [key: string]: string } = {};

  // Validate required fields
  if (!email || email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!password || password.length === 0) {
    errors.password = "Password is required";
  }

  // Return validation errors if any
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      message: "Validation failed",
      errors,
    });
  }

  const db = getDB();
  console.log("Database users:", db.users);
  console.log("Looking for user with email:", email, "and password:", password);
  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );
  console.log("Found user:", user);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({
    id: user.id,
    email: user.email,
    name: user.name,
  });
  res.status(200).json({ token });
}
