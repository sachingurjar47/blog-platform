import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useRouter } from "next/router";
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Link from "next/link";
import { loginSchema } from "../schemas/validation";
import { ApiError } from "../types/api";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    try {
      // Validate form
      await loginSchema.validate({ email, password }, { abortEarly: false });

      await loginMutation.mutateAsync({ email, password });
      // Small delay to ensure token is set and auth state is updated
      setTimeout(() => {
        router.push("/");
      }, 100);
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        // Mark all fields as touched to show errors
        setTouched({ email: true, password: true });

        // Handle Yup validation errors
        const validationErrors: { [key: string]: string } = {};
        if ("inner" in error && Array.isArray(error.inner)) {
          error.inner.forEach((err: { path?: string; message?: string }) => {
            if (err.path && err.message) {
              validationErrors[err.path] = err.message;
            }
          });
        }
        setErrors(validationErrors);
      } else {
        // Handle API validation errors
        const apiError = error as ApiError;
        if (apiError.response?.data?.errors) {
          setTouched({ email: true, password: true });
          setErrors(apiError.response.data.errors);
        } else if (apiError.response?.data?.message) {
          // Handle general API errors (like "Invalid credentials")
          setTouched({ email: true, password: true });
          setErrors({ general: apiError.response.data.message });
        } else {
          // Handle other errors
          setTouched({ email: true, password: true });
          setErrors({ general: "Login failed. Please try again." });
        }
      }
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    // Mark field as touched
    setTouched({ ...touched, [field]: true });

    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }

    // Update field value
    switch (field) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
    }
  };

  const shouldShowError = (field: string) => {
    return !!errors[field];
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
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            data-testid="login-form"
            onSubmit={handleSubmit}
            noValidate
            width="100%"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            {errors.general && (
              <Box
                sx={{
                  color: "error.main",
                  fontSize: "0.875rem",
                  textAlign: "center",
                  p: 1,
                  bgcolor: "error.light",
                  borderRadius: 1,
                }}
              >
                {errors.general}
              </Box>
            )}
            <TextField
              label="Email"
              placeholder="Enter email"
              type="email"
              value={email}
              onChange={(e) => handleFieldChange("email", e.target.value)}
              fullWidth
              size="small"
              error={shouldShowError("email")}
              helperText={shouldShowError("email") ? errors.email : ""}
              inputProps={{ "data-testid": "email-input" }}
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              type="password"
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              fullWidth
              size="small"
              error={shouldShowError("password")}
              helperText={shouldShowError("password") ? errors.password : ""}
              inputProps={{ "data-testid": "password-input" }}
            />
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loginMutation.isPending}
              data-testid="login-button"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </Box>
          <Typography variant="body2">
            Don&apos;t have an account? <Link href="/register">Sign Up</Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
