import type { NextApiRequest, NextApiResponse } from "next";
import { getDB } from "@/lib/db";
import { verifyToken } from "@/lib/jwt";
import { EditorJSData } from "@/types/editorjs";

// Utility function to extract text content from EditorJSData or string
function extractTextContent(content: string | EditorJSData): string {
  if (typeof content === 'string') {
    return content;
  }

  if (!content || !content.blocks) {
    return '';
  }

  return content.blocks
    .map((block) => {
      switch (block.type) {
        case 'header':
          return block.data.text || '';
        case 'paragraph':
          return block.data.text || '';
        case 'list':
          return block.data.items?.join(' ') || '';
        case 'quote':
          return block.data.text || '';
        case 'code':
          return block.data.code || '';
        case 'warning':
          return `${block.data.title || ''} ${block.data.message || ''}`;
        case 'image':
          return block.data.caption || '';
        case 'embed':
          return block.data.caption || '';
        case 'delimiter':
          return '---';
        default:
          return '';
      }
    })
    .join(' ')
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

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

        const contentText = extractTextContent(post.content).toLowerCase();
        return (
          post.title.toLowerCase().includes(searchLower) ||
          contentText.includes(searchLower) ||
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
