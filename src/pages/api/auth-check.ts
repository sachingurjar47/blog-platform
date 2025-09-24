import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1] || req.cookies?.token;
  if (!token) return res.status(401).json({ authenticated: false });

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).json({ authenticated: false });

  return res.status(200).json({ authenticated: true, user: decoded });
}
