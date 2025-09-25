import { useRouter } from "next/router";
import { usePost, useDeletePost } from "@/hooks/usePosts";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditorJSRenderer from "../../components/EditorJSRenderer";
import LikeButton from "../../components/LikeButton";
import { EditorJSData } from "../../types/editorjs";
import { useAuthCheck } from "@/hooks/useAuth";

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: post, isLoading } = usePost(id);
  const deletePostMutation = useDeletePost();
  const { data: authData } = useAuthCheck();

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

  if (!post) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Post not found</Alert>
      </Container>
    );
  }

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePostMutation.mutateAsync(id as string);
      router.push("/");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
          <IconButton
            onClick={() => router.back()}
            title="Go back"
            color="primary"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" component="h1">
            {post.title}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1, ml: 2 }}>
          <IconButton
            onClick={() => router.push(`/edit-post/${id}`)}
            title="Edit post"
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={handleDeletePost}
            title="Delete post"
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <Chip
          icon={<PersonIcon />}
          label={post.creator?.name || "Unknown Author"}
          variant="outlined"
        />
        <Chip
          icon={<AccessTimeIcon />}
          label={`Created: ${formatDate(post.createdAt)}`}
          variant="outlined"
        />
        {post.updatedAt !== post.createdAt && (
          <Chip
            icon={<UpdateIcon />}
            label={`Updated: ${formatDate(post.updatedAt)}`}
            variant="outlined"
          />
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 4 }}>
        {typeof post.content === "string" ? (
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            {post.content}
          </Typography>
        ) : (
          <EditorJSRenderer data={post.content as EditorJSData} />
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <LikeButton
          postId={post.id}
          isLiked={
            post.likedBy?.some((item) => item === authData?.user?.id) || false
          }
          likesCount={post.likes}
          size="medium"
        />
      </Box>
    </Container>
  );
};

export default PostDetailPage;
