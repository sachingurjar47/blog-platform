import { useState } from "react";
import { useRouter } from "next/router";
import { useCreatePost } from "../hooks/usePosts";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CreatePostPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const createPostMutation = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await createPostMutation.mutateAsync({
      title: title.trim(),
      content: content.trim(),
    });
    router.push("/");
  };

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
          Create New Post
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
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createPostMutation.isPending || !title.trim() || !content.trim()
              }
            >
              {createPostMutation.isPending ? "Creating..." : "Create Post"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreatePostPage;

