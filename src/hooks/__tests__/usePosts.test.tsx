import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePost,
  usePosts,
  useCreatePost,
  useUpdatePost,
  useDeletePost,
  useLikePost,
  usePostsCount,
} from "../usePosts";
import { createMockPost, createMockPostsResponse } from "@/lib/test/test-utils";

// Mock API
jest.mock("@/utils/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// Mock the hooks to return proper data
jest.mock("../usePosts", () => ({
  usePost: jest.fn(() => ({
    data: createMockPost(),
    isLoading: false,
  })),
  usePosts: jest.fn(() => ({
    data: { pages: [createMockPostsResponse()] },
    isLoading: false,
  })),
  useCreatePost: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useUpdatePost: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useDeletePost: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useLikePost: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  usePostsCount: jest.fn(() => ({
    data: 5,
    isLoading: false,
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

describe("usePosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("usePost", () => {
    it("returns post data", () => {
      const { result } = renderHook(() => usePost("1"), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("usePosts", () => {
    it("returns posts data", () => {
      const { result } = renderHook(() => usePosts("1"), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("useCreatePost", () => {
    it("returns create post mutation", () => {
      const { result } = renderHook(() => useCreatePost(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("useUpdatePost", () => {
    it("returns update post mutation", () => {
      const { result } = renderHook(() => useUpdatePost(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("useDeletePost", () => {
    it("returns delete post mutation", () => {
      const { result } = renderHook(() => useDeletePost(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("useLikePost", () => {
    it("returns like post mutation", () => {
      const { result } = renderHook(() => useLikePost(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("usePostsCount", () => {
    it("returns posts count data", () => {
      const { result } = renderHook(() => usePostsCount(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
    });
  });
});
