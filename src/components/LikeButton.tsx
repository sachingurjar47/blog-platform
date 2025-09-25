import React from "react";
import {
  IconButton,
  Tooltip,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useLikePost } from "../hooks/usePosts";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  likesCount: number;
  size?: "small" | "medium";
  showCount?: boolean;
  disabled?: boolean;
  variant?: "icon" | "button" | "chip";
}

const LikeButton: React.FC<LikeButtonProps> = ({
  postId,
  isLiked,
  likesCount,
  size = "medium",
  showCount = true,
  disabled = false,
  variant = "icon",
}) => {
  const likePostMutation = useLikePost();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || likePostMutation.isPending) return;

    try {
      await likePostMutation.mutateAsync(postId);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const iconSize = size === "small" ? "small" : "medium";
  const iconColor = isLiked ? "error" : "action";

  if (variant === "chip") {
    return (
      <Chip
        icon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        label={likesCount}
        onClick={handleLike}
        disabled={disabled || likePostMutation.isPending}
        color={isLiked ? "error" : "default"}
        variant={isLiked ? "filled" : "outlined"}
        size={size}
        sx={{
          cursor:
            disabled || likePostMutation.isPending ? "default" : "pointer",
          "&:hover": {
            backgroundColor: isLiked ? "error.dark" : "action.hover",
          },
          transition: "all 0.2s ease-in-out",
        }}
      />
    );
  }

  if (variant === "button") {
    return (
      <Button
        startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        onClick={handleLike}
        disabled={disabled || likePostMutation.isPending}
        color={isLiked ? "error" : "inherit"}
        variant={isLiked ? "contained" : "outlined"}
        size={size}
        sx={{
          borderRadius: 2,
          transition: "all 0.2s ease-in-out",
        }}
      >
        {showCount
          ? `${isLiked ? "Liked" : "Like"} (${likesCount})`
          : isLiked
          ? "Liked"
          : "Like"}
      </Button>
    );
  }

  // Default icon variant
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      <Tooltip title={isLiked ? "Unlike" : "Like"} arrow>
        <IconButton
          onClick={handleLike}
          disabled={disabled || likePostMutation.isPending}
          size={size}
          sx={{
            color: isLiked ? "error.main" : "text.secondary",
            "&:hover": {
              color: isLiked ? "error.dark" : "error.main",
              backgroundColor: isLiked ? "error.light" : "action.hover",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          {isLiked ? (
            <FavoriteIcon fontSize={iconSize} />
          ) : (
            <FavoriteBorderIcon fontSize={iconSize} />
          )}
        </IconButton>
      </Tooltip>
      {showCount && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minWidth: "20px",
            textAlign: "center",
            fontWeight: isLiked ? 600 : 400,
            color: isLiked ? "error.main" : "text.secondary",
          }}
        >
          {likesCount}
        </Typography>
      )}
    </Box>
  );
};

export default LikeButton;
