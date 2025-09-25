import type { NextApiRequest, NextApiResponse } from "next";
import { getDB, saveDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";

function getUserFromToken(token?: string) {
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded || null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const auth = req.headers.authorization;
  const token = auth?.split(" ")[1] || req.cookies?.token;
  const user = getUserFromToken(token);

  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.query;
  const db = await getDB();
  const post = db.posts.find((p) => p.id === String(id));
  if (!post) return res.status(404).json({ message: "Not found" });

  if (req.method === "GET") {
    const creator = db.users.find((u) => u.id === post.createdBy);
    return res.status(200).json({
      ...post,
      creator: creator
        ? { id: creator.id, name: creator.name, email: creator.email }
        : null,
    });
  } else if (req.method === "PUT") {
    const userId = (user as { id: string }).id;

    if (post.createdBy !== userId) {
      return res.status(403).json({
        message: "Not authorized to edit this post",
        details: {
          userId,
          postCreatorId: post.createdBy,
          postId: post.id,
        },
      });
    }

    const { title, content } = req.body || {};
    if (title) post.title = title;
    if (content) post.content = content;
    post.updatedAt = new Date().toISOString();

    await saveDB(db);
    return res.status(200).json(post);
  } else if (req.method === "DELETE") {
    if (post.createdBy !== (user as { id: string }).id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    db.posts = db.posts.filter((p) => p.id !== String(id));
    await saveDB(db);
    return res.status(200).json({ message: "Post deleted successfully" });
  } else if (req.method === "POST") {
    const userId = (user as { id: string }).id;
    const isLiked = post.likedBy.includes(userId);

    if (isLiked) {
      post.likedBy = post.likedBy.filter((id) => id !== userId);
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.likedBy.push(userId);
      post.likes++;
    }

    await saveDB(db);
    return res.status(200).json({
      ...post,
      isLiked: !isLiked,
    });
  } else {
    res.setHeader("Allow", "GET,POST,PUT,DELETE");
    return res.status(405).end();
  }
}
