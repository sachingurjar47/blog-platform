import { object, string, mixed } from "yup";

// Registration form validation schema
export const registrationSchema = object({
  name: string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name must be less than 50 characters")
    .trim(),
  email: string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be less than 100 characters"),
});

// Login form validation schema
export const loginSchema = object({
  email: string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .trim(),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters long"),
});

// Post creation/editing validation schema
export const postSchema = object({
  title: string()
    .required("Title is required")
    .min(1, "Title cannot be empty")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  content: mixed()
    .required("Content is required")
    .test("content-validation", "Content cannot be empty", function (value) {
      // Handle both string and EditorJSData
      if (typeof value === "string") {
        return value.trim().length > 0;
      }
      if (typeof value === "object" && value !== null) {
        // For EditorJSData, check if there are blocks with content
        const editorData = value as { blocks?: unknown[] };
        return editorData.blocks && editorData.blocks.length > 0;
      }
      return false;
    }),
});

// Type definitions for form data
export type RegistrationFormData = {
  name: string;
  email: string;
  password: string;
};

export type LoginFormData = {
  email: string;
  password: string;
};

export type PostFormData = {
  title: string;
  content: string | unknown; // EditorJSData or string
};
