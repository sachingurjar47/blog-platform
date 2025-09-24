import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "../../lib/db";
import { signToken } from "../../lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body || {};
  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  const db = getDB();
  const user = db.users.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken({ id: user.id, email: user.email });
  res.status(200).json({ token });
}
