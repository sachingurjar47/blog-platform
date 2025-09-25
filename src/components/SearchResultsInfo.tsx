import React, { memo } from "react";
import { Typography } from "@mui/material";

/**
 * Props interface for the SearchResultsInfo component
 */
interface SearchResultsInfoProps {
  searchQuery: string;
  totalResults: number;
}

/**
 * Component that displays search results information
 * Features:
 * - Shows total number of results
 * - Displays search query
 * - Responsive design
 * - Memoized for performance
 */
const SearchResultsInfo: React.FC<SearchResultsInfoProps> = memo(
  ({ searchQuery, totalResults }) => {
    if (!searchQuery.trim()) return null;

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2, fontStyle: "italic" }}
      >
        {`Found ${totalResults} post${
          totalResults !== 1 ? "s" : ""
        } matching "${searchQuery}"`}
      </Typography>
    );
  }
);

// Set display name for better debugging
SearchResultsInfo.displayName = "SearchResultsInfo";

export default SearchResultsInfo;
