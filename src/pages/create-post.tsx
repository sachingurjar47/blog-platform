import { useState, useCallback, useEffect } from "react";
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
import RichTextEditor from "../components/RichTextEditor";
import { EditorJSData } from "../types/editorjs";
import {
  cleanupUploadedImages,
  clearUploadedImages,
} from "../utils/imageCleanup";
import { postSchema } from "../schemas/validation";

const CreatePostPage = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<EditorJSData | undefined>(undefined);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const createPostMutation = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    try {
      // Validate form
      const formData = {
        title: title.trim(),
        content: content || { time: Date.now(), blocks: [], version: "2.28.2" },
      };
      await postSchema.validate(formData, { abortEarly: false });

      await createPostMutation.mutateAsync({
        title: title.trim(),
        content: content!,
      });
      // Clear uploaded images tracking since post was successfully created
      clearUploadedImages();
      router.push("/");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        // Mark all fields as touched to show errors
        setTouched({ title: true, content: true });

        // Handle Yup validation errors
        const validationErrors: { [key: string]: string } = {};
        if ("inner" in error && Array.isArray(error.inner)) {
          error.inner.forEach((err: { path?: string; message?: string }) => {
            if (err.path && err.message) {
              validationErrors[err.path] = err.message;
            }
          });
        }
        setErrors(validationErrors);
      } else {
        console.error("Error creating post:", error);
      }
    }
  };

  const handleContentChange = useCallback(
    (data: EditorJSData) => {
      setContent(data);
      // Clear content error when user starts editing
      if (errors.content) {
        setErrors({ ...errors, content: "" });
      }
    },
    [errors]
  );

  const handleTitleChange = (value: string) => {
    setTitle(value);
    // Mark field as touched and clear error
    setTouched({ ...touched, title: true });
    if (errors.title) {
      setErrors({ ...errors, title: "" });
    }
  };

  const shouldShowError = (field: string) => {
    return !!errors[field];
  };

  const handleCancel = useCallback(async () => {
    // Clean up any uploaded images before navigating away
    await cleanupUploadedImages();
    router.back();
  }, [router]);

  // Clean up images when component unmounts (user navigates away)
  useEffect(() => {
    return () => {
      // Only cleanup if the post wasn't successfully created
      if (!createPostMutation.isSuccess) {
        cleanupUploadedImages();
      }
    };
  }, [createPostMutation.isSuccess]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleCancel}
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
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <TextField
            label="Post Title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            fullWidth
            placeholder="Enter a compelling title..."
            error={shouldShowError("title")}
            helperText={shouldShowError("title") ? errors.title : ""}
          />
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 500 }}>
              Post Content
            </Typography>
            <RichTextEditor
              data={content}
              onChange={handleContentChange}
              placeholder="Write your post content here..."
              minHeight={400}
            />
            {shouldShowError("content") && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 1, display: "block" }}
              >
                {errors.content}
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              disabled={createPostMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={
                createPostMutation.isPending || !title.trim() || !content
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
