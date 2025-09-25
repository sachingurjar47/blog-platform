import React from "react";
import { render, screen, fireEvent } from "@/lib/test/test-utils";
import Home from "../../pages/index";
import { createMockPostsResponse } from "@/lib/test/test-utils";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
  }),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mock-token"),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock API
jest.mock("@/utils/api", () => ({
  get: jest.fn(),
}));

// Mock the hooks
jest.mock("@/hooks/useAuth", () => ({
  useCurrentUser: () => ({
    id: "user-123",
    email: "test@example.com",
    name: "Test User",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }),
  useAuthCheck: () => ({
    data: { authenticated: true },
    isLoading: false,
  }),
}));

jest.mock("@/hooks/usePosts", () => ({
  usePosts: () => ({
    data: { pages: [createMockPostsResponse()] },
    isLoading: false,
    fetchNextPage: jest.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
  }),
  useDeletePost: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
  useLikePost: () => ({
    mutate: jest.fn(),
    isLoading: false,
  }),
}));

describe("BlogListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders blog list page", () => {
    render(<Home />);

    expect(screen.getByText("Blogs")).toBeInTheDocument();
  });

  it("renders page header", () => {
    render(<Home />);

    expect(screen.getByTestId("page-header")).toBeInTheDocument();
  });

  it("renders search bar", () => {
    render(<Home />);

    expect(screen.getByTestId("search-bar")).toBeInTheDocument();
  });

  it("renders posts grid", () => {
    render(<Home />);

    expect(screen.getByText("Test Post")).toBeInTheDocument();
  });

  it("handles search input change", () => {
    render(<Home />);

    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test search" } });

    expect(searchInput).toHaveValue("test search");
  });

  it("renders without crashing", () => {
    expect(() => render(<Home />)).not.toThrow();
  });
});
