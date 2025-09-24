import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import api from "../utils/api";
import { toast } from "react-hot-toast";
import type { ApiError, Post, PostsResponse } from "../types/api";

export const usePost = (id: string) => {
  return useQuery<Post>({
    queryKey: ["post", id],
    queryFn: async () => {
      const res = await api.get(`/posts/${id}`);
      return res.data;
    },
    staleTime: 1000 * 60,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { title: string; content: string }) => {
      const res = await api.post("/posts/create", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as ApiError)?.response?.data?.message || "Failed to create post"
      ),
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { title: string; content: string };
    }) => {
      const res = await api.put(`/posts/${id}`, data);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post updated successfully!");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as ApiError)?.response?.data?.message || "Failed to update post"
      ),
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/posts/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as ApiError)?.response?.data?.message || "Failed to delete post"
      ),
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/posts/${id}`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (err: unknown) =>
      toast.error(
        (err as ApiError)?.response?.data?.message || "Failed to like post"
      ),
  });
};

export const usePosts = (searchQuery: string = "") => {
  return useInfiniteQuery<PostsResponse>({
    queryKey: ["posts", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: pageParam.toString(),
        limit: "10",
      });

      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      const res = await api.get(`/posts?${params.toString()}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.page + 1 : undefined;
    },
    staleTime: 1000 * 60,
  });
};
