import React, { memo } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

/**
 * Props interface for the PageHeader component
 */
interface PageHeaderProps {
  title: string;
  buttonText: string;
  onButtonClick: () => void;
  buttonIcon?: React.ReactNode;
}

/**
 * Page header component with title and action button
 * Features:
 * - Responsive design
 * - Customizable button text and icon
 * - Consistent styling
 * - Memoized for performance
 */
const PageHeader: React.FC<PageHeaderProps> = memo(
  ({ title, buttonText, onButtonClick, buttonIcon = <AddIcon /> }) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Button
          variant="contained"
          startIcon={buttonIcon}
          onClick={onButtonClick}
          sx={{ minWidth: 140 }}
        >
          {buttonText}
        </Button>
      </Box>
    );
  }
);

// Set display name for better debugging
PageHeader.displayName = "PageHeader";

export default PageHeader;
