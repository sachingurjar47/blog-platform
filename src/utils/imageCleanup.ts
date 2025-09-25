import api from "./api";

// Track uploaded images during editing session
let uploadedImages: string[] = [];

export const trackUploadedImage = (imageUrl: string) => {
  uploadedImages.push(imageUrl);
  console.log("Tracked image:", imageUrl);
};

export const removeUploadedImage = (imageUrl: string) => {
  uploadedImages = uploadedImages.filter((url) => url !== imageUrl);
  console.log("Removed from tracking:", imageUrl);
};

export const cleanupUploadedImages = async () => {
  console.log("Cleaning up uploaded images:", uploadedImages);

  if (uploadedImages.length === 0) {
    console.log("No images to clean up");
    return;
  }

  const deletePromises = uploadedImages.map(async (imageUrl) => {
    try {
      console.log("Attempting to delete image:", imageUrl);
      await api.delete("/delete-image", { data: { imageUrl } });
      console.log("Successfully deleted:", imageUrl);
    } catch (error) {
      console.error("Failed to delete image:", imageUrl, error);
    }
  });

  await Promise.all(deletePromises);
  uploadedImages = []; // Clear the tracking array
  console.log("Image cleanup completed");
};

export const getUploadedImages = () => uploadedImages;

export const clearUploadedImages = () => {
  uploadedImages = [];
};
