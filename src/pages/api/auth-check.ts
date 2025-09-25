import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../lib/jwt";

/**
 * API route for checking authentication status
 * Features:
 * - Token validation
 * - User data extraction from JWT
 * - Proper error handling
 * - Returns user information if authenticated
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      message: "Method not allowed",
      allowedMethods: ["GET"],
    });
  }

  try {
    // Extract token from Authorization header or cookies
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No authentication token provided",
      });
    }

    // Verify the token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        authenticated: false,
        message: "Invalid or expired token",
      });
    }

    // Extract user information from decoded token
    const user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
    };

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return res.status(500).json({
      authenticated: false,
      message: "Internal server error",
    });
  }
}
