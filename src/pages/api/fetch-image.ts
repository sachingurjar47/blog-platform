import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    // Validate that it's a valid image URL
    const imageUrl = new URL(url);
    const allowedDomains = [
      "images.unsplash.com",
      "picsum.photos",
      "via.placeholder.com",
    ];

    if (!allowedDomains.some((domain) => imageUrl.hostname.includes(domain))) {
      return res.status(400).json({ message: "Invalid image URL domain" });
    }

    // For now, just return the URL as-is
    // In production, you might want to download and store the image
    res.status(200).json({
      success: 1,
      file: {
        url: url,
      },
    });
  } catch (error) {
    console.error("Image fetch error:", error);
    res.status(500).json({ message: "Failed to fetch image" });
  }
}
