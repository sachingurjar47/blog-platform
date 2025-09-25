import React from "react";
import { render, screen, fireEvent } from "@/lib/test/test-utils";
import RegisterPage from "../../pages/register";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/register",
    query: {},
  }),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mock-token"),
  set: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock API
jest.mock("@/utils/api", () => ({
  post: jest.fn(),
}));

// Mock the hooks
jest.mock("@/hooks/useAuth", () => ({
  useRegister: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useAuthCheck: () => ({
    data: { authenticated: false },
    isLoading: false,
  }),
}));

describe("RegisterPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders register form", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("renders name input", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("name-input")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders register button", () => {
    render(<RegisterPage />);

    expect(screen.getByTestId("register-button")).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(<RegisterPage />);

    const nameInput = screen.getByTestId("name-input");
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders without crashing", () => {
    expect(() => render(<RegisterPage />)).not.toThrow();
  });
});
