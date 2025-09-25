import React from "react";
import { render, screen, fireEvent } from "@/lib/test/test-utils";
import LoginPage from "../../pages/login";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/login",
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
  useLogin: () => ({
    mutate: jest.fn(),
    isPending: false,
  }),
  useAuthCheck: () => ({
    data: { authenticated: false },
    isLoading: false,
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("renders password input", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("password-input")).toBeInTheDocument();
  });

  it("renders login button", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("login-button")).toBeInTheDocument();
  });

  it("handles form input changes", () => {
    render(<LoginPage />);

    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });

  it("renders without crashing", () => {
    expect(() => render(<LoginPage />)).not.toThrow();
  });
});
