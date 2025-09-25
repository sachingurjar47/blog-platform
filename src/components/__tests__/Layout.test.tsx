import React from "react";
import { render, screen } from "@/lib/test/test-utils";
import Layout from "../Layout";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: "/",
    query: {},
  }),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(() => "mock-token"),
  remove: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock useAuthCheck hook
jest.mock("@/hooks/useAuth", () => ({
  useAuthCheck: () => ({
    data: { authenticated: true },
    isLoading: false,
  }),
}));

describe("Layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("renders AppBar component", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByTestId("app-bar")).toBeInTheDocument();
  });

  it("renders main content with correct structure", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass("MuiBox-root");
  });

  it("applies correct styling to main content", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const main = screen.getByRole("main");
    expect(main).toHaveClass("MuiBox-root");
  });

  it("renders children with correct styling", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    const content = screen.getByTestId("test-content");
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveClass("MuiBox-root");
  });

  it("maintains consistent layout structure", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    // Check that AppBar is rendered
    expect(screen.getByTestId("app-bar")).toBeInTheDocument();

    // Check that main content area is rendered
    expect(screen.getByRole("main")).toBeInTheDocument();

    // Check that children are rendered
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("handles multiple children correctly", () => {
    render(
      <Layout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <div data-testid="child-3">Child 3</div>
      </Layout>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("renders without crashing when no children provided", () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );

    expect(screen.getByTestId("app-bar")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("maintains proper DOM hierarchy", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    );

    const appBar = screen.getByTestId("app-bar");
    const main = screen.getByRole("main");
    const content = screen.getByTestId("test-content");

    // AppBar should be rendered
    expect(appBar).toBeInTheDocument();

    // Main should be rendered
    expect(main).toBeInTheDocument();

    // Content should be inside main
    expect(main).toContainElement(content);
  });
});
