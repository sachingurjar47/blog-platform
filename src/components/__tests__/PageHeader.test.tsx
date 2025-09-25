import React from "react";
import { render, screen, fireEvent } from "@/lib/test/test-utils";
import PageHeader from "../PageHeader";

describe("PageHeader", () => {
  const mockOnButtonClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders title correctly", () => {
    render(
      <PageHeader
        title="Test Title"
        buttonText="Test Button"
        onButtonClick={mockOnButtonClick}
      />
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders button correctly", () => {
    render(
      <PageHeader
        title="Test Title"
        buttonText="Test Button"
        onButtonClick={mockOnButtonClick}
      />
    );

    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("calls onButtonClick when button is clicked", () => {
    render(
      <PageHeader
        title="Test Title"
        buttonText="Test Button"
        onButtonClick={mockOnButtonClick}
      />
    );

    const button = screen.getByText("Test Button");
    fireEvent.click(button);

    expect(mockOnButtonClick).toHaveBeenCalled();
  });

  it("applies correct styling to container", () => {
    render(
      <PageHeader
        title="Test Title"
        buttonText="Test Button"
        onButtonClick={mockOnButtonClick}
      />
    );

    const container = screen.getByTestId("page-header");
    expect(container).toHaveClass("MuiBox-root");
  });

  it("renders without crashing", () => {
    expect(() =>
      render(
        <PageHeader
          title="Test Title"
          buttonText="Test Button"
          onButtonClick={mockOnButtonClick}
        />
      )
    ).not.toThrow();
  });
});
