import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1] || req.cookies?.token;
  const decoded = token && verifyToken(token as string);
  if (!decoded) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "GET") {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const db = getDB();

    const userMap = new Map(db.users.map((user) => [user.id, user]));
    let filteredPosts = db.posts;

    if (search.trim()) {
      const searchLower = search.toLowerCase().trim();
      filteredPosts = db.posts.filter((post) => {
        const creator = userMap.get(post.createdBy);
        const creatorName = creator?.name?.toLowerCase() || "";
        const creatorEmail = creator?.email?.toLowerCase() || "";

        return (
          post.title.toLowerCase().includes(searchLower) ||
          post.content.toLowerCase().includes(searchLower) ||
          creatorName.includes(searchLower) ||
          creatorEmail.includes(searchLower)
        );
      });
    }

    filteredPosts.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedPosts = filteredPosts.slice(start, end);

    const postsWithCreators = paginatedPosts.map((post) => {
      const creator = userMap.get(post.createdBy);
      return {
        ...post,
        creator: creator
          ? { id: creator.id, name: creator.name, email: creator.email }
          : null,
      };
    });

    return res.status(200).json({
      posts: postsWithCreators,
      total: filteredPosts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredPosts.length / limit),
      hasNextPage: page < Math.ceil(filteredPosts.length / limit),
      hasPrevPage: page > 1,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
