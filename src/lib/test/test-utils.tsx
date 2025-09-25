import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { User, Post, AuthResponse, PostsResponse } from "@/types/api";
import { EditorJSData, EditorJSBlock } from "@/types/editorjs";

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const theme = createTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Test data factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: "1",
  email: "test@example.com",
  name: "Test User",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  ...overrides,
});

export const createMockPost = (overrides: Partial<Post> = {}): Post => ({
  id: "1",
  title: "Test Post",
  content: "Test content",
  likes: 0,
  likedBy: [],
  createdBy: "1",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  creator: {
    id: "1",
    name: "Test User",
    email: "test@example.com",
  },
  isLiked: false,
  ...overrides,
});

export const createMockPostsResponse = (
  overrides: Partial<PostsResponse> = {}
): PostsResponse => ({
  posts: [createMockPost()],
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
  ...overrides,
});

export const createMockAuthResponse = (
  overrides: Partial<AuthResponse> = {}
): AuthResponse => ({
  authenticated: true,
  user: createMockUser(),
  ...overrides,
});

export const createMockEditorJSData = (
  blocks?: EditorJSBlock[]
): EditorJSData => ({
  time: Date.now(),
  blocks: blocks || [
    {
      id: "1",
      type: "paragraph",
      data: { text: "Test content" },
    },
  ],
  version: "2.22.2",
});
