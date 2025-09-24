import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useLikePost, usePost, useDeletePost } from "@/hooks/usePosts";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import UpdateIcon from "@mui/icons-material/Update";

const PostDetailPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: post, isLoading } = usePost(id);
  const likeMutation = useLikePost();
  const deletePostMutation = useDeletePost();

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

  const handleLike = () => {
    likeMutation.mutate(id, {
      onSuccess: () =>
        toast.success(post?.isLiked ? "Post unliked!" : "Post liked!"),
    });
  };

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
        <Typography variant="h3" component="h1" sx={{ flex: 1 }}>
          {post.title}
        </Typography>
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

      <Typography variant="body1" paragraph sx={{ mb: 4, lineHeight: 1.8 }}>
        {post.content}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          variant={post.isLiked ? "contained" : "outlined"}
          color="error"
          startIcon={<FavoriteIcon />}
          onClick={handleLike}
          disabled={likeMutation.isPending}
          sx={{ borderRadius: 2 }}
        >
          {likeMutation.isPending
            ? "Processing..."
            : `${post.isLiked ? "Liked" : "Like"} (${post.likes})`}
        </Button>
      </Box>
    </Container>
  );
};

export default PostDetailPage;
