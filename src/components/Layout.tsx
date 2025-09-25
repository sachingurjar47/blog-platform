import { ReactNode, memo } from "react";
import ProtectedRoute from "./ProtectedRoute";
import AppBar from "./AppBar";
import { Box } from "@mui/material";

/**
 * Props interface for the Layout component
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * Provides consistent layout structure with authentication protection
 *
 * Features:
 * - Protected route wrapper for authenticated users
 * - Responsive app bar and content area
 * - Optimized with React.memo for performance
 */
const Layout = memo(({ children }: LayoutProps) => {
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
