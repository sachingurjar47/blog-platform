import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Create as CreateIcon,
} from "@mui/icons-material";
import { logout } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useAuthCheck } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { getInitials } from "@/utils";
import { useState, useCallback, memo } from "react";
import type { AuthResponse } from "../types/api";

/**
 * Application bar component for authenticated users
 * Provides navigation and user account management
 *
 * Features:
 * - Responsive design with mobile-friendly menu
 * - User avatar with initials
 * - Quick navigation to main pages
 * - Logout functionality
 * - Optimized with React.memo for performance
 */
const AppBar = memo(() => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: authData, isLoading } = useAuthCheck();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isAuthenticated = (authData as AuthResponse)?.authenticated;
  const userName = (authData as AuthResponse)?.user?.name || "User";
  const userInitials = getInitials(userName);

  /**
   * Handles user logout and redirects to login page
   */
  const handleLogout = useCallback(() => {
    logout(queryClient);
    router.push("/login");
    setAnchorEl(null);
  }, [queryClient, router]);

  /**
   * Handles navigation to home page
   */
  const handleHomeClick = useCallback(() => {
    router.push("/");
    setAnchorEl(null);
  }, [router]);

  /**
   * Handles navigation to create post page
   */
  const handleCreatePostClick = useCallback(() => {
    router.push("/create-post");
    setAnchorEl(null);
  }, [router]);

  /**
   * Handles user menu open/close
   */
  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // Don't render if not authenticated or still loading
  if (!isAuthenticated || isLoading) return null;

  return (
    <MuiAppBar
      position="fixed"
      elevation={2}
      sx={{
        backgroundColor: "primary.main",
        backdropFilter: "blur(10px)",
      }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 600,
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={handleHomeClick}
        >
          Blog Platform
        </Typography>

        {/* Navigation Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={handleHomeClick}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Home
          </Button>

          <Button
            color="inherit"
            startIcon={<CreateIcon />}
            onClick={handleCreatePostClick}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            Create Post
          </Button>

          {/* User Menu */}
          <IconButton
            size="large"
            onClick={handleMenuOpen}
            sx={{
              color: "inherit",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "secondary.main",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              {userInitials}
            </Avatar>
          </IconButton>

          {/* User Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 200,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1,
                },
              },
            }}
          >
            <MenuItem onClick={handleMenuClose} disabled>
              <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
              {userName}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleHomeClick}>
              <HomeIcon sx={{ mr: 1, fontSize: 20 }} />
              Home
            </MenuItem>
            <MenuItem onClick={handleCreatePostClick}>
              <CreateIcon sx={{ mr: 1, fontSize: 20 }} />
              Create Post
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
});

// Set display name for better debugging
AppBar.displayName = "AppBar";

export default AppBar;
