import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory in the root
const uploadDirectory = path.join(__dirname, "..", "..", "uploads");

// Ensure the base upload directory exists
try {
  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
    console.log("Created base upload directory:", uploadDirectory);
  }
} catch (error) {
  console.error("Error creating base upload directory:", error.message);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  // Allow only images with specified MIME types
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    const error = new Error(
      "Invalid file type. Only JPEG, PNG, and GIF are allowed."
    );
    error.code = "INVALID_FILE_TYPE"; // Add a custom error code
    cb(error, false); // Reject the file with the error
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
