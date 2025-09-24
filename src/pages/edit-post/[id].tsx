import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { usePost, useUpdatePost } from "@/hooks/usePosts";

const EditPostPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: post, isLoading, error } = usePost(id);
  const updatePostMutation = useUpdatePost();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await updatePostMutation.mutateAsync({
      id: id as string,
      data: { title: title.trim(), content: content.trim() },
    });
    router.push(`/posts/${id}`);
  };

  if (isLoading) {
    return (
      <Container
        maxWidth="md"
        sx={{ py: 4, display: "flex", justifyContent: "center" }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (error || !post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Post not found or error loading post</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.back()}
          variant="outlined"
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Edit Post
        </Typography>
      </Box>

      <Paper sx={{ p: 4 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            placeholder="Enter a compelling title..."
          />
          <TextField
            label="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            required
            multiline
            rows={8}
            placeholder="Write your post content here..."
          />
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={updatePostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                updatePostMutation.isPending || !title.trim() || !content.trim()
              }
            >
              {updatePostMutation.isPending ? "Updating..." : "Update Post"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditPostPage;

