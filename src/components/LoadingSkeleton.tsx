import React from "react";
import { Box, Card, Skeleton } from "@mui/material";

/**
 * Props interface for the LoadingSkeleton component
 */
interface LoadingSkeletonProps {
  count?: number;
  variant?: "post" | "post-detail";
}

/**
 * Loading skeleton component for better loading states
 * Features:
 * - Customizable count
 * - Different variants for different content types
 * - Responsive design
 * - Smooth animations
 */
const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  variant = "post",
}) => {
  if (variant === "post-detail") {
    return (
      <Box sx={{ maxWidth: "md", mx: "auto", p: 3 }}>
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="90%" height={24} sx={{ mb: 3 }} />
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{ mb: 2 }}
        />
        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="100%" height={24} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="70%" height={24} sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} height={24} />
          <Skeleton variant="text" width={100} height={24} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      data-testid="loading-skeleton"
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      {[...Array(count)].map((_, index) => (
        <Card key={index} sx={{ p: 2 }}>
          <Skeleton
            variant="text"
            width="60%"
            height={32}
            data-testid="skeleton-item"
          />
          <Skeleton
            variant="text"
            width="100%"
            height={20}
            data-testid="skeleton-item"
          />
          <Skeleton
            variant="text"
            width="80%"
            height={20}
            data-testid="skeleton-item"
          />
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Skeleton
              variant="rectangular"
              width={80}
              height={24}
              data-testid="skeleton-item"
            />
            <Skeleton
              variant="rectangular"
              width={100}
              height={24}
              data-testid="skeleton-item"
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
