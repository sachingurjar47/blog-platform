import { ReactNode, memo } from "react";
import ProtectedRoute from "./ProtectedRoute";
import AppBar from "./AppBar";
import { Box } from "@mui/material";
import { useAuthCheck } from "@/hooks/useAuth";
import type { AuthResponse } from "../types/api";

/**
 * Props interface for the Layout component
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * Handles authentication state and provides consistent layout structure
 *
 * Features:
 * - Conditional rendering based on authentication status
 * - Protected route wrapper for authenticated users
 * - Responsive app bar and content area
 * - Optimized with React.memo for performance
 */
const Layout = memo(({ children }: LayoutProps) => {
  const { data: authData, isLoading } = useAuthCheck();
  const isAuthenticated = (authData as AuthResponse)?.authenticated;

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        {children}
      </Box>
    );
  }

  // For unauthenticated users, render children directly
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // For authenticated users, wrap with protected route and app bar
  return (
    <ProtectedRoute>
      <AppBar />
      <Box
        component="main"
        sx={{
          overflow: "auto",
          top: 64, // AppBar height
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
          backgroundColor: "background.default",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {children}
      </Box>
    </ProtectedRoute>
  );
});

// Set display name for better debugging
Layout.displayName = "Layout";

export default Layout;
