import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../utils/api";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import type {
  ApiError,
  AuthResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/api";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/register", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Registration successful!");
    },
    onError: (err: unknown) =>
      toast.error(
        (err as ApiError)?.response?.data?.message || "Registration failed"
      ),
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await api.post("/login", data);
      Cookies.set("token", res.data.token);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      toast.success("Login successful!");
    },
    onError: (err: unknown) =>
      toast.error((err as ApiError)?.response?.data?.message || "Login failed"),
  });
};

export const useAuthCheck = () => {
  return useQuery<AuthResponse>({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await api.get("/auth-check");
      return res.data;
    },
    staleTime: 1000 * 60,
    retry: false,
  });
};

export const logout = (queryClient: ReturnType<typeof useQueryClient>) => {
  Cookies.remove("token");
  queryClient.setQueryData(["auth"], { authenticated: false });
  queryClient.invalidateQueries({ queryKey: ["auth"] });
  toast.success("Logged out successfully!");
};
