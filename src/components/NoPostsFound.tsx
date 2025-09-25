import React, { memo } from "react";
import { Paper, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * Props interface for the NoPostsFound component
 */
interface NoPostsFoundProps {
  hasSearchQuery: boolean;
  onCreatePost: () => void;
}

/**
 * Component displayed when no posts are found
 * Features:
 * - Different messages for search vs no posts
 * - Call-to-action button
 * - Responsive design
 * - Memoized for performance
 */
const NoPostsFound: React.FC<NoPostsFoundProps> = memo(
  ({ hasSearchQuery, onCreatePost }) => {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: "center",
          border: "2px dashed",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {hasSearchQuery
            ? "No posts found matching your search"
            : "No posts yet"}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {hasSearchQuery
            ? "Try adjusting your search terms or create a new post"
            : "Be the first to create a post and start the conversation!"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreatePost}
          size="large"
        >
          {hasSearchQuery ? "Create New Post" : "Create First Post"}
        </Button>
      </Paper>
    );
  }
);

// Set display name for better debugging
NoPostsFound.displayName = "NoPostsFound";

export default NoPostsFound;
