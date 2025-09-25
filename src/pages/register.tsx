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
import { registrationSchema } from "../schemas/validation";
import { ApiError } from "../types/api";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    try {
      // Validate form
      await registrationSchema.validate(
        { name, email, password },
        { abortEarly: false }
      );

      await registerMutation.mutateAsync({ name, email, password });
      router.push("/login");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "name" in error &&
        error.name === "ValidationError"
      ) {
        // Mark all fields as touched to show errors
        setTouched({ name: true, email: true, password: true });

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
          setTouched({ name: true, email: true, password: true });
          setErrors(apiError.response.data.errors);
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
      case "name":
        setName(value);
        break;
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
            <PersonAddAltIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            width="100%"
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Name"
              placeholder="Enter your name"
              type="text"
              value={name}
              onChange={(e) => handleFieldChange("name", e.target.value)}
              fullWidth
              size="small"
              error={shouldShowError("name")}
              helperText={shouldShowError("name") ? errors.name : ""}
            />
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
            />
            <TextField
              label="Password"
              placeholder="Enter password (min 6 characters)"
              type="password"
              value={password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
              fullWidth
              size="small"
              error={shouldShowError("password")}
              helperText={shouldShowError("password") ? errors.password : ""}
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
