import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { logout } from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useAuthCheck } from "../hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const AppBar = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: authData } = useAuthCheck();
  const authenticated = authData?.authenticated;

  const handleLogout = () => {
    logout(queryClient);
    router.push("/login");
  };

  if (!authenticated) return null;

  return (
    <>
      <MuiAppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Blog Platform
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" onClick={() => router.push("/")}>
              Home
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </>
  );
};

export default AppBar;
