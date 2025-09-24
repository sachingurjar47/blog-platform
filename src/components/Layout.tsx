import { ReactNode } from "react";
import ProtectedRoute from "./ProtectedRoute";
import AppBar from "./AppBar";
import { Box } from "@mui/material";
import { useAuthCheck } from "@/hooks/useAuth";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { data: authenticated } = useAuthCheck();
  if (!authenticated) {
    return children;
  }
  return (
    <ProtectedRoute>
      <AppBar />
      <Box
        sx={{
          overflow: "auto",
          top: 64,
          bottom: 0,
          left: 0,
          right: 0,
          position: "absolute",
        }}
      >
        {children}
      </Box>
    </ProtectedRoute>
  );
};

export default Layout;
