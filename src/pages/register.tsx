import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ email, password });
      router.push("/login");
    } catch {
      // toast handled in hook
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={2}
    >
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 420 }}>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <PersonAddAltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            width="100%"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              size="small"
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating..." : "Create account"}
            </Button>
          </Box>
          <Typography variant="body2">
            Already have an account? <Link href="/login">Sign in</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
