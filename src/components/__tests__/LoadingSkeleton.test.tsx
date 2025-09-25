import React from "react";
import { render, screen } from "@/lib/test/test-utils";
import LoadingSkeleton from "../LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders skeleton elements correctly", () => {
    render(<LoadingSkeleton />);

    expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
  });

  it("renders correct number of skeleton items", () => {
    render(<LoadingSkeleton />);

    const skeletonItems = screen.getAllByTestId("skeleton-item");
    expect(skeletonItems).toHaveLength(15); // 3 cards × 5 skeleton items each
  });

  it("applies correct styling to skeleton container", () => {
    render(<LoadingSkeleton />);

    const container = screen.getByTestId("loading-skeleton");
    expect(container).toHaveClass("MuiBox-root");
  });

  it("applies correct styling to skeleton items", () => {
    render(<LoadingSkeleton />);

    const skeletonItems = screen.getAllByTestId("skeleton-item");
    skeletonItems.forEach((item) => {
      expect(item).toHaveClass("MuiSkeleton-root");
    });
  });

  it("renders without crashing", () => {
    expect(() => render(<LoadingSkeleton />)).not.toThrow();
  });
});
