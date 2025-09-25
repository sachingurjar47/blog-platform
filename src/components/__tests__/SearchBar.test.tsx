import React from "react";
import { render, screen, fireEvent } from "@/lib/test/test-utils";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders search input correctly", () => {
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("calls onChange when input value changes", () => {
    render(<SearchBar value="" onChange={mockOnChange} />);

    const input = screen.getByTestId("search-input");
    fireEvent.change(input, { target: { value: "test search" } });

    expect(mockOnChange).toHaveBeenCalledWith("test search");
  });

  it("applies correct styling to container", () => {
    render(<SearchBar value="" onChange={mockOnChange} />);

    const container = screen.getByTestId("search-bar");
    expect(container).toHaveClass("MuiBox-root");
  });

  it("renders without crashing", () => {
    expect(() =>
      render(<SearchBar value="" onChange={mockOnChange} />)
    ).not.toThrow();
  });
});
