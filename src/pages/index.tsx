import { usePosts, useDeletePost } from "../hooks/usePosts";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Button,
  IconButton,
  Chip,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const BlogListPage = () => {
  const router = useRouter();
  const deletePostMutation = useDeletePost();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts(debouncedSearch);

  const allPosts = useMemo(() => {
    return data?.pages.flatMap((page) => page.posts) || [];
  }, [data]);

  const totalPosts = data?.pages[0]?.total || 0;

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deletePostMutation.mutateAsync(postId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h3" component="h1">
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push("/create-post")}
        >
          Create Post
        </Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search posts by title, content, or author..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3 }}
      />

      {isLoading && allPosts.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {allPosts.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: "center" }}>
              <Typography variant="h5" color="text.secondary" gutterBottom>
                {debouncedSearch
                  ? "No posts found matching your search"
                  : "No posts yet"}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {debouncedSearch
                  ? "Try adjusting your search terms"
                  : "Be the first to create a post and start the conversation!"}
              </Typography>
              {!debouncedSearch && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => router.push("/create-post")}
                  size="large"
                >
                  Create First Post
                </Button>
              )}
            </Paper>
          ) : (
            <>
              {debouncedSearch && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Found {totalPosts} post{totalPosts !== 1 ? "s" : ""} matching
                  "{debouncedSearch}"
                </Typography>
              )}
              {allPosts.map((post) => (
                <Card key={post.id} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
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
                        <Typography variant="h6" component="h2" gutterBottom>
                          {post.title}
                        </Typography>
                      </Link>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/edit-post/${post.id}`)}
                          title="Edit post"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePost(post.id)}
                          title="Delete post"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {post.content.slice(0, 150)}...
                    </Typography>

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
                      />
                      <Chip
                        icon={<AccessTimeIcon />}
                        label={formatDate(post.createdAt)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`${post.likes} likes`}
                        size="small"
                        color="primary"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </Box>
      )}

      <Box ref={sentinelRef} sx={{ height: 24 }} />
      {isFetchingNextPage && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <CircularProgress size={20} />
        </Box>
      )}
    </Container>
  );
};

export default BlogListPage;
