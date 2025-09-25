import React, { memo, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LikeButton from "./LikeButton";
import { truncateContent } from "../utils/contentUtils";
import { formatDate } from "../utils";
import type { Post, User } from "../types/api";

/**
 * Props interface for the PostCard component
 */
interface PostCardProps {
  post: Post;
  currentUser: User | null;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

/**
 * Individual post card component
 * Features:
 * - Responsive design
 * - Hover effects
 * - Action buttons (edit/delete)
 * - Like functionality
 * - Author and date information
 * - Memoized for performance
 */
const PostCard = memo(
  ({ post, currentUser, onEdit, onDelete }: PostCardProps) => {
    const isLiked = useMemo(() => {
      return Boolean(post.likedBy?.some((item) => item === currentUser?.id));
    }, [post.likedBy, currentUser?.id]);

    return (
      <Card
        sx={{
          "&:hover": {
            bgcolor: "grey.50",
            transform: "translateY(-2px)",
            boxShadow: 2,
          },
          transition: "all 0.2s ease-in-out",
          cursor: "pointer",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Link
              href={`/posts/${post.id}`}
              style={{ textDecoration: "none", flex: 1 }}
            >
              <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{
                  color: "text.primary",
                  "&:hover": {
                    color: "primary.main",
                  },
                  transition: "color 0.2s ease-in-out",
                }}
              >
                {post.title}
              </Typography>
            </Link>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post.id);
                }}
                title="Edit post"
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(post.id);
                }}
                title="Delete post"
                sx={{
                  "&:hover": {
                    backgroundColor: "error.light",
                    color: "white",
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, lineHeight: 1.6 }}
          >
            {truncateContent(post.content, 150)}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<PersonIcon />}
                label={post.creator?.name || "Unknown Author"}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
              <Chip
                icon={<AccessTimeIcon />}
                label={formatDate(post.createdAt)}
                size="small"
                variant="outlined"
                sx={{ fontSize: "0.75rem" }}
              />
            </Box>
            <LikeButton
              postId={post.id}
              isLiked={isLiked}
              likesCount={post.likes}
              size="small"
            />
          </Box>
        </CardContent>
      </Card>
    );
  }
);

// Set display name for better debugging
PostCard.displayName = "PostCard";

export default PostCard;
