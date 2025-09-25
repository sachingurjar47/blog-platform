import { usePosts, useDeletePost } from "../hooks/usePosts";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { Box, Container, CircularProgress, Alert, Button } from "@mui/material";
import PostCard from "../components/PostCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/SearchBar";
import NoPostsFound from "../components/NoPostsFound";
import SearchResultsInfo from "../components/SearchResultsInfo";
import PageHeader from "../components/PageHeader";
import { useCurrentUser } from "@/hooks/useAuth";
import type { Post, PostsResponse } from "../types/api";

/**
 * Main blog listing page component
 * Features:
 * - Infinite scroll pagination
 * - Real-time search with debouncing
 * - Post management (edit/delete)
 * - Like functionality
 * - Responsive design
 * - Loading states and error handling
 */
const BlogListPage = () => {
  const router = useRouter();
  const deletePostMutation = useDeletePost();
  const [search, setSearch] = useState("");
  const currentUser = useCurrentUser();
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch posts with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = usePosts(debouncedSearch);

  // Flatten all posts from all pages
  const allPosts = useMemo(() => {
    if (!data?.pages) return [];
    return (data.pages as PostsResponse[]).flatMap((page) => page.posts);
  }, [data]);

  const totalPosts = (data?.pages?.[0] as PostsResponse)?.total || 0;

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /**
   * Handles post deletion with confirmation
   */
  const handleDeletePost = useCallback(
    async (postId: string) => {
      if (window.confirm("Are you sure you want to delete this post?")) {
        try {
          await deletePostMutation.mutateAsync(postId);
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      }
    },
    [deletePostMutation]
  );

  /**
   * Handles navigation to create post page
   */
  const handleCreatePost = useCallback(() => {
    router.push("/create-post");
  }, [router.push]);

  /**
   * Handles navigation to edit post page
   */
  const handleEditPost = useCallback(
    (postId: string) => {
      router.push(`/edit-post/${postId}`);
    },
    [router.push]
  );

  // Show error state if there's an error
  if (isError) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load posts. Please try again later.
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",

        height: "calc(100vh - 64px)",
        overflow: "hidden",
      }}
    >
      {/* Fixed Header Section */}
      <Box
        sx={{
          flexShrink: 0,
          backgroundColor: "background.default",
          borderBottom: 1,
          borderColor: "divider",
          zIndex: 1,
        }}
      >
        <Container maxWidth="md" sx={{ py: 2 }}>
          <PageHeader
            title="Blogs"
            buttonText="Create Post"
            onButtonClick={handleCreatePost}
          />
          <SearchBar value={search} onChange={setSearch} disabled={isLoading} />
        </Container>
      </Box>

      {/* Scrollable Content Section */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="md" sx={{ py: 2 }}>
          {isLoading && allPosts.length === 0 ? (
            <LoadingSkeleton count={3} variant="post" />
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {allPosts.length === 0 ? (
                <NoPostsFound
                  hasSearchQuery={!!debouncedSearch}
                  onCreatePost={handleCreatePost}
                />
              ) : (
                <>
                  {/* Search Results Info */}
                  <SearchResultsInfo
                    searchQuery={debouncedSearch}
                    totalResults={totalPosts}
                  />

                  {/* Posts List */}
                  {allPosts.map((post: Post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onEdit={handleEditPost}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </>
              )}

              {/* Infinite Scroll Sentinel */}
              <Box ref={sentinelRef} sx={{ height: 24 }} />
              {isFetchingNextPage && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <CircularProgress size={20} />
                </Box>
              )}
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default BlogListPage;
