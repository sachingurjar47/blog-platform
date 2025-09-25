import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";

export function signToken(payload: object, expiresIn: string = "1h"): string {
  return jwt.sign(payload, SECRET, { expiresIn } as SignOptions);
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}
