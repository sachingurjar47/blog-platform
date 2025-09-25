import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
// import { EditorJSData } from "@/types/editorjs";
import { extractTextContent } from "@/utils/contentUtils";

/**
 * API route for fetching posts with pagination and search
 * Features:
 * - Pagination support
 * - Search functionality across title, content, and author
 * - Authentication required
 * - Optimized text extraction
 * - Error handling
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

    // Parse query parameters with validation
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 10)
    );
    const search = (req.query.search as string) || "";

    const db = getDB();

    // Create user lookup map for efficient creator resolution
    const userMap = new Map(db.users.map((user) => [user.id, user]));

    // Filter posts based on search query
    let filteredPosts = db.posts;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredPosts = db.posts.filter((post) => {
        const creator = userMap.get(post.createdBy);
        const creatorName = creator?.name?.toLowerCase() || "";
        const creatorEmail = creator?.email?.toLowerCase() || "";
        const contentText = extractTextContent(
          post.content as string | { blocks: { type: string; data: unknown }[] }
        ).toLowerCase();

        return (
          post.title.toLowerCase().includes(searchLower) ||
          contentText.includes(searchLower) ||
          creatorName.includes(searchLower) ||
          creatorEmail.includes(searchLower)
        );
      });
    }

    // Sort posts by creation date (newest first)
    filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Calculate pagination
    const totalPosts = filteredPosts.length;
    const totalPages = Math.ceil(totalPosts / limit);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = filteredPosts.slice(start, end);

    // Add creator information to posts
    const postsWithCreators = paginatedPosts.map((post) => {
      const creator = userMap.get(post.createdBy);
      return {
        ...post,
        creator: creator
          ? {
              id: creator.id,
              name: creator.name,
              email: creator.email,
            }
          : null,
      };
    });

    // Return paginated response
    return res.status(200).json({
      posts: postsWithCreators,
      total: totalPosts,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: "Failed to fetch posts",
    });
  }
}
