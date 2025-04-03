import multer from "multer";
import path from "path";
import fs from "fs/promises"; // Use promises for cleaner async handling
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory in the root
const uploadDirectory = path.resolve(__dirname, "..", "..", "uploads");

// Ensure the base upload directory exists (async)
const ensureUploadDirectory = async () => {
  try {
    await fs.mkdir(uploadDirectory, { recursive: true });
    // console.log("Created base upload directory:", uploadDirectory);
  } catch (error) {
    if (error.code !== "EEXIST") { // Ignore if directory already exists
      // console.error("Error creating base upload directory:", error.message);
      throw error; // Rethrow to handle in the app
    }
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await ensureUploadDirectory(); // Ensure directory exists before upload
      cb(null, uploadDirectory);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`; // Normalize extension
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    const error = new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
    error.code = "INVALID_FILE_TYPE";
    cb(error, false); // Reject the file
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB file size limit
  },
});

// Initialize directory on module load (optional, depending on your setup)
ensureUploadDirectory().catch((err) => {
  console.error("Failed to initialize upload directory:", err.message);
});