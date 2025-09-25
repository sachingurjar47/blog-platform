import React, { memo, useCallback } from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikePost } from "../hooks/usePosts";

/**
 * Props interface for the LikeButton component
 */
interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  size?: "small" | "medium";
  disabled?: boolean;
  showCount?: boolean;
}

/**
 * Like button component for posts
 * Features:
 * - Optimistic UI updates
 * - Loading states
 * - Accessibility support
 * - Responsive design
 * - Memoized for performance
 */
const LikeButton: React.FC<LikeButtonProps> = memo(({
  postId,
  isLiked,
  likesCount,
  size = "medium",
  disabled = false,
  showCount = true,
}) => {
  const likePostMutation = useLikePost();

  /**
   * Handles like/unlike action
   */
  const handleLike = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || likePostMutation.isPending) return;

    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  }, [postId, disabled, likePostMutation]);

  const isPending = likePostMutation.isPending;
  const isDisabled = disabled || isPending;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {showCount && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minWidth: 20,
            textAlign: "center",
            fontSize: size === "small" ? "0.75rem" : "0.875rem",
            fontWeight: 500,
          }}
        >
          {likesCount}
        </Typography>
      )}
      
      <Tooltip 
        title={isLiked ? "Unlike this post" : "Like this post"}
        placement="top"
      >
        <IconButton
          size={size}
          onClick={handleLike}
          disabled={isDisabled}
          sx={{
            cursor: isDisabled ? "default" : "pointer",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: isDisabled ? "none" : "scale(1.1)",
              backgroundColor: isLiked ? "error.light" : "primary.light",
              color: "white",
            },
            "&:active": {
              transform: isDisabled ? "none" : "scale(0.95)",
            },
            color: isLiked ? "error.main" : "text.secondary",
          }}
          aria-label={isLiked ? "Unlike post" : "Like post"}
          aria-pressed={isLiked}
        >
          {isLiked ? (
            <FavoriteIcon 
              fontSize={size}
              sx={{
                animation: isPending ? "pulse 1.5s ease-in-out infinite" : "none",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.2)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
          ) : (
            <FavoriteBorderIcon 
              fontSize={size}
              sx={{
                animation: isPending ? "pulse 1.5s ease-in-out infinite" : "none",
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.2)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  );
});

// Set display name for better debugging
LikeButton.displayName = "LikeButton";

export default LikeButton;
