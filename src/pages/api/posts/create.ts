import type { NextApiRequest, NextApiResponse } from "next";
import { getDB, saveDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { v4 as uuidv4 } from "uuid";
// import { EditorJSData } from "@/types/editorjs";

/**
 * API route for creating a new post
 * Features:
 * - Authentication required
 * - Input validation
 * - Content sanitization
 * - Error handling
 * - Type safety
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      message: "Method not allowed",
      allowedMethods: ["POST"],
    });
  }

  try {
    // Authentication check
    const auth = req.headers.authorization;
    const token = auth?.split(" ")[1] || req.cookies?.token;
    const decoded = token && verifyToken(token as string);

    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized",
        error: "Invalid or missing authentication token",
      });
    }

    // Validate request body
    const { title, content } = req.body || {};

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return res.status(400).json({
        message: "Validation error",
        error: "Title is required and must be a non-empty string",
      });
    }

    if (!content) {
      return res.status(400).json({
        message: "Validation error",
        error: "Content is required",
      });
    }

    // Validate content type (string or EditorJSData)
    const isValidContent =
      typeof content === "string" ||
      (typeof content === "object" && content !== null && "blocks" in content);

    if (!isValidContent) {
      return res.status(400).json({
        message: "Validation error",
        error: "Content must be a string or valid EditorJS data",
      });
    }

    // Sanitize title
    const sanitizedTitle = title.trim().substring(0, 200); // Limit title length

    // Get database and create new post
    const db = await getDB();
    const now = new Date().toISOString();
    const userId = (decoded as { id: string }).id;

    const newPost = {
      id: uuidv4(),
      title: sanitizedTitle,
      content: content as string | unknown, // Allow both string and EditorJSData
      likes: 0,
      likedBy: [],
      createdBy: userId,
      createdAt: now,
      updatedAt: now,
    };

    // Add post to database
    db.posts.push(newPost);
    await saveDB(db);

    // Return created post
    return res.status(201).json({
      ...newPost,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: "Failed to create post",
    });
  }
}
