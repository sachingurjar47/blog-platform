import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";

export function signToken(payload: object, expiresIn: string = "1h") {
  return jwt.sign(payload, SECRET, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
