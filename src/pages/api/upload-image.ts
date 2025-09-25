import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  console.log("Image upload request received");

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: uploadsDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
      filter: (part) => {
        return Boolean(part.mimetype && part.mimetype.includes("image"));
      },
    });

    const [fields, files] = await form.parse(req);
    const file = Array.isArray(files.image) ? files.image[0] : files.image;

    if (!file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    // Generate unique filename
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}${path.extname(file.originalFilename || "")}`;
    const newPath = path.join(uploadsDir, uniqueFilename);

    // Rename file to unique name
    fs.renameSync(file.filepath, newPath);

    // Return the public URL
    const publicUrl = `/uploads/${uniqueFilename}`;

    console.log("Image uploaded successfully:", publicUrl);

    res.status(200).json({
      success: 1,
      file: {
        url: publicUrl,
      },
    });
  } catch (error) {
    console.error("Image upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
}
