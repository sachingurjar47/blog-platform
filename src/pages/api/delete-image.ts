import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: "Image URL is required" });
  }

  try {
    // Extract filename from URL (handle both relative and absolute URLs)
    let filename: string;

    console.log("Deleting image with URL:", imageUrl);

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      // Absolute URL
      const url = new URL(imageUrl);
      filename = path.basename(url.pathname);
    } else {
      // Relative URL (e.g., /uploads/filename.jpg)
      filename = path.basename(imageUrl);
    }

    console.log("Extracted filename:", filename);

    const filePath = path.join(process.cwd(), "public", "uploads", filename);
    console.log("File path:", filePath);

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Delete the file
      fs.unlinkSync(filePath);
      console.log(`Deleted image: ${filename}`);
      return res.status(200).json({ message: "Image deleted successfully" });
    } else {
      return res.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Failed to delete image" });
  }
}
