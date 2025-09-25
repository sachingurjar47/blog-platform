import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import type {
  ApiError,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
  User,
} from "../types/api";

/**
 * Registration form data interface
 */
interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

/**
 * Login form data interface
 */
interface LoginData {
  email: string;
  password: string;
}

/**
 * Custom hook for user registration
 * Features:
 * - Form validation
 * - Error handling
 * - Success notifications
 * - Type safety
 */
export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterData>({
    mutationFn: async (data: RegisterData) => {
      const res = await api.post("/register", data);
      return res.data;
    },
    onSuccess: (data) => {
      // Store token if provided
      if (data.token) {
        Cookies.set("token", data.token, {
          expires: 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });
      }
      toast.success("Registration successful! Welcome to the platform!");
    },
    onError: (error: ApiError) => {
      const errorMessage =
        error?.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      console.error("Registration error:", error);
    },
  });
};

/**
 * Custom hook for user login
 * Features:
 * - Token management
 * - Cache invalidation
 * - Error handling
 * - Success notifications
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, ApiError, LoginData>({
    mutationFn: async (data: LoginData) => {
      const res = await api.post("/login", data);
      return res.data;
    },
    onSuccess: (data) => {
      // Store token securely
      Cookies.set("token", data.token, {
        expires: 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      console.log("Token set in cookies:", data.token);

      // Invalidate and refetch auth data
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      // Force refetch the auth data to get updated user info
      queryClient.refetchQueries({ queryKey: ["auth"] });
      toast.success("Login successful! Welcome back!");
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    },
  });
};

/**
 * Custom hook for authentication status check
 * Features:
 * - Cached authentication state
 * - Automatic token validation
 * - Error handling
 * - Optimized refetching
 */
export const useAuthCheck = () => {
  return useQuery<AuthResponse, ApiError>({
    queryKey: ["auth"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth-check");
        return res.data;
      } catch (error: any) {
        // Handle 401 responses as valid data (user not authenticated)
        if (error?.response?.status === 401) {
          return error.response.data as AuthResponse;
        }
        // Re-throw other errors
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: ApiError) => {
      // Don't retry on 401 (unauthorized) errors
      if (error?.response?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

/**
 * Logout utility function
 * Features:
 * - Token removal
 * - Cache cleanup
 * - User feedback
 * - Type safety
 */
export const logout = (queryClient: ReturnType<typeof useQueryClient>) => {
  try {
    // Remove token from cookies
    Cookies.remove("token");

    // Clear auth data from cache immediately to prevent API interceptor from firing
    queryClient.setQueryData<AuthResponse>(["auth"], {
      authenticated: false,
      user: undefined,
    });

    // Cancel any pending requests to prevent 401 errors
    queryClient.cancelQueries();

    // Invalidate all queries to refresh data
    queryClient.invalidateQueries();

    toast.success("Logged out successfully!");
  } catch (error) {
    console.error("Logout error:", error);
    toast.error("An error occurred during logout");
  }
};

/**
 * Custom hook for getting current user data
 * Returns user data from auth context
 */
export const useCurrentUser = (): User | null => {
  const { data: authData } = useAuthCheck();
  return authData?.user || null;
};

/**
 * Custom hook for checking if user is authenticated
 * Returns boolean authentication status
 */
export const useIsAuthenticated = (): boolean => {
  const { data: authData } = useAuthCheck();
  return authData?.authenticated || false;
};
