import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import type { ApiError, Post, PostsResponse } from "../types/api";
import type { EditorJSData } from "../types/editorjs";

/**
 * Post creation data interface
 */
interface CreatePostData {
  title: string;
  content: string | EditorJSData;
}

/**
 * Post update data interface
 */
interface UpdatePostData {
  id: string;
  data: {
    title: string;
    content: string | EditorJSData;
  };
}

/**
 * Custom hook for fetching a single post
 * Features:
 * - Cached data
 * - Error handling
 * - Optimized refetching
 */
export const usePost = (id: string) => {
  return useQuery<Post, ApiError>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!id, // Only run if id is provided
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};

/**
 * Custom hook for creating a new post
 * Features:
 * - Optimistic updates
 * - Cache invalidation
 * - Error handling
 * - Success notifications
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, ApiError, CreatePostData>({
    mutationFn: async (data: CreatePostData) => {
      const res = await api.post("/posts/create", data);
      return res.data;
    },
    onSuccess: (newPost) => {
      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Add the new post to the cache
      queryClient.setQueryData(["post", newPost.id], newPost);

      toast.success("Post created successfully!");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to create post";
      toast.error(errorMessage);
      console.error("Create post error:", error);
    },
  });
};

/**
 * Custom hook for updating an existing post
 * Features:
 * - Optimistic updates
 * - Cache invalidation
 * - Error handling
 * - Success notifications
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, ApiError, UpdatePostData>({
    mutationFn: async ({ id, data }: UpdatePostData) => {
      const res = await api.put(`/posts/${id}`, data);
      return res.data;
    },
    onSuccess: (updatedPost, { id }) => {
      // Update the specific post in cache
      queryClient.setQueryData(["post", id], updatedPost);

      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post updated successfully!");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update post";
      toast.error(errorMessage);
      console.error("Update post error:", error);
    },
  });
};

/**
 * Custom hook for deleting a post
 * Features:
 * - Optimistic updates
 * - Cache invalidation
 * - Error handling
 * - Success notifications
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, string>({
    mutationFn: async (id: string) => {
      await api.delete(`/posts/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Remove the post from cache
      queryClient.removeQueries({ queryKey: ["post", deletedId] });

      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      toast.success("Post deleted successfully!");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to delete post";
      toast.error(errorMessage);
      console.error("Delete post error:", error);
    },
  });
};

/**
 * Custom hook for liking/unliking a post
 * Features:
 * - Optimistic updates
 * - Cache invalidation
 * - Error handling
 * - Silent operation (no toast)
 */
export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, ApiError, string>({
    mutationFn: async (id: string) => {
      const res = await api.post(`/posts/${id}`);
      return res.data;
    },
    onSuccess: (updatedPost, id) => {
      // Update the specific post in cache
      queryClient.setQueryData(["post", id], updatedPost);

      // Invalidate posts list to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to like post";
      toast.error(errorMessage);
      console.error("Like post error:", error);
    },
  });
};

/**
 * Custom hook for fetching posts with infinite scroll
 * Features:
 * - Infinite scroll pagination
 * - Search functionality
 * - Cached data
 * - Error handling
 * - Optimized refetching
 */
export const usePosts = (searchQuery: string = "") => {
  return useInfiniteQuery<PostsResponse, ApiError>({
    queryKey: ["posts", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const page = typeof pageParam === "number" ? pageParam : 1;
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await api.get(`/posts?${params.toString()}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: ApiError) => {
      if (
        error?.response?.status &&
        error?.response?.status >= 400 &&
        error?.response?.status < 500
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false, // Disable to prevent unnecessary refetches
  });
};

/**
 * Custom hook for getting posts count
 * Returns the total number of posts
 */
export const usePostsCount = () => {
  const { data } = usePosts();
  return data?.pages[0]?.total || 0;
};
