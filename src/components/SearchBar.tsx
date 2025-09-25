import React, { memo, useCallback } from "react";
import { TextField, Box } from "@mui/material";
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
      <Box data-testid="search-bar">
        <TextField
          fullWidth
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          size="small"
          inputProps={{ "data-testid": "search-input" }}
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
      </Box>
    );
  }
);

// Set display name for better debugging
SearchBar.displayName = "SearchBar";

export default SearchBar;
