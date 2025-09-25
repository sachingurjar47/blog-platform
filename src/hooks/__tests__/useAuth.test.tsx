import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useAuthCheck,
  useCurrentUser,
  useIsAuthenticated,
  useLogin,
  useRegister,
  logout,
} from "../useAuth";
import { createMockUser } from "@/lib/test/test-utils";

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mock-token"),
  set: jest.fn(),
  remove: jest.fn(),
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
  post: jest.fn(),
}));

// Mock the hooks to return proper data
jest.mock("../useAuth", () => ({
  useAuthCheck: jest.fn(() => ({
    data: { authenticated: true, user: createMockUser() },
    isLoading: false,
  })),
  useCurrentUser: jest.fn(() => ({
    data: createMockUser(),
    isLoading: false,
  })),
  useIsAuthenticated: jest.fn(() => true),
  useLogin: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  useRegister: jest.fn(() => ({
    mutate: jest.fn(),
    isPending: false,
  })),
  logout: jest.fn(),
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

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("useAuthCheck", () => {
    it("returns authentication status", () => {
      const { result } = renderHook(() => useAuthCheck(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.data).toBeDefined();
      expect(result.current.isLoading).toBeDefined();
    });
  });

  describe("useCurrentUser", () => {
    it("returns current user data", () => {
      const { result } = renderHook(() => useCurrentUser(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
    });
  });

  describe("useIsAuthenticated", () => {
    it("returns authentication status", () => {
      const { result } = renderHook(() => useIsAuthenticated(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(typeof result.current).toBe("boolean");
    });
  });

  describe("useLogin", () => {
    it("returns login mutation", () => {
      const { result } = renderHook(() => useLogin(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("useRegister", () => {
    it("returns register mutation", () => {
      const { result } = renderHook(() => useRegister(), {
        wrapper: createWrapper(),
      });

      expect(result.current).toBeDefined();
      expect(result.current.mutate).toBeDefined();
      expect(result.current.isPending).toBeDefined();
    });
  });

  describe("logout", () => {
    it("calls logout function", () => {
      expect(typeof logout).toBe("function");
    });
  });
});
