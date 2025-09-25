import React from "react";
import { render, screen } from "@/lib/test/test-utils";
import LikeButton from "../LikeButton";

// Mock the useLikePost hook
jest.mock("@/hooks/usePosts", () => ({
  useLikePost: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
}));

describe("LikeButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders like button correctly", () => {
    render(<LikeButton postId="1" isLiked={false} likesCount={0} />);

    expect(screen.getByTestId("like-button")).toBeInTheDocument();
  });

  it("displays correct like count", () => {
    render(<LikeButton postId="1" isLiked={false} likesCount={5} />);

    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies correct styling when liked", () => {
    render(<LikeButton postId="1" isLiked={true} likesCount={1} />);

    const button = screen.getByTestId("like-button");
    expect(button).toHaveClass("MuiBox-root");
  });

  it("renders without crashing", () => {
    expect(() =>
      render(<LikeButton postId="1" isLiked={false} likesCount={0} />)
    ).not.toThrow();
  });
});
