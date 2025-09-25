import React from "react";
import { render, screen } from "@/lib/test/test-utils";
import NoPostsFound from "../NoPostsFound";

describe("NoPostsFound", () => {
  const mockOnCreatePost = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders no posts found message", () => {
    render(
      <NoPostsFound hasSearchQuery={false} onCreatePost={mockOnCreatePost} />
    );

    expect(screen.getByText("No posts found")).toBeInTheDocument();
  });

  it("renders correct icon", () => {
    render(
      <NoPostsFound hasSearchQuery={false} onCreatePost={mockOnCreatePost} />
    );

    expect(screen.getByTestId("no-posts-icon")).toBeInTheDocument();
  });

  it("applies correct styling to container", () => {
    render(
      <NoPostsFound hasSearchQuery={false} onCreatePost={mockOnCreatePost} />
    );

    const container = screen.getByTestId("no-posts-container");
    expect(container).toHaveClass("MuiPaper-root");
  });

  it("renders without crashing", () => {
    expect(() =>
      render(
        <NoPostsFound hasSearchQuery={false} onCreatePost={mockOnCreatePost} />
      )
    ).not.toThrow();
  });
});
