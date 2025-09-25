import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret_key_change_me";

/**
 * Custom JWT payload interface
 */
interface CustomJwtPayload extends JwtPayload {
  id: string;
  email: string;
  name?: string;
}

/**
 * Signs a JWT token with user data
 * @param payload - User data to include in token
 * @param expiresIn - Token expiration time (default: 1h)
 * @returns Signed JWT token
 */
export function signToken(
  payload: { id: string; email: string; name?: string },
  expiresIn: string = "1h"
): string {
  return jwt.sign(payload, SECRET, { expiresIn } as SignOptions);
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export function verifyToken(token: string): CustomJwtPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as CustomJwtPayload;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}
