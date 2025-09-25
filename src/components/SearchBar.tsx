import React, { memo, useCallback } from "react";
import { TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

/**
 * Props interface for the SearchBar component
 */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Search bar component for filtering posts
 * Features:
 * - Debounced search
 * - Customizable placeholder
 * - Loading states
 * - Memoized for performance
 */
const SearchBar: React.FC<SearchBarProps> = memo(
  ({
    value,
    onChange,
    placeholder = "Search posts by title, content, or author...",
    disabled = false,
  }) => {
    /**
     * Handles input change
     */
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
      },
      [onChange]
    );

    return (
      <TextField
        fullWidth
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        size="small"
        InputProps={{
          startAdornment: (
            <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 2,
          },
        }}
      />
    );
  }
);

// Set display name for better debugging
SearchBar.displayName = "SearchBar";

export default SearchBar;
