import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload directory in the root
const baseUploadDirectory = path.join(__dirname, "..", "..", "uploads");
// console.log("Base Upload Directory:", baseUploadDirectory);

// Ensure the base upload directory exists
if (!fs.existsSync(baseUploadDirectory)) {
  fs.mkdirSync(baseUploadDirectory, { recursive: true });
  console.log("Created base upload directory");
}

// Define specific directories for different file types
const bannerDirectory = path.join(baseUploadDirectory, "banner");
const avatarDirectory = path.join(baseUploadDirectory, "avatar");
// console.log("Banner Directory:", bannerDirectory);
// console.log("Avatar Directory:", avatarDirectory);

// Ensure specific directories exist
if (!fs.existsSync(bannerDirectory)) {
  fs.mkdirSync(bannerDirectory, { recursive: true });
  console.log("Created banner directory");
}
if (!fs.existsSync(avatarDirectory)) {
  fs.mkdirSync(avatarDirectory, { recursive: true });
  console.log("Created avatar directory");
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = baseUploadDirectory;
    if (file.fieldname === "banner") {
      uploadDir = bannerDirectory;
    } else if (file.fieldname === "avatar") {
      uploadDir = avatarDirectory;
    }
    // console.log("Upload Directory:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    // console.log("Filename:", filename);
    cb(null, filename);
  },
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "banner") {
    // Allow only images
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type for banner image. Only JPEG, PNG, and GIF are allowed."
        )
      );
    }
  } else if (file.fieldname === "avatar") {
    // Allow only images
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type for avatar image. Only JPEG, PNG, and GIF are allowed."
        )
      );
    }
  } else {
    cb(new Error("Unknown file field."));
  }
};

// Create Multer instance with configured storage and file filter
export const upload = multer({
  storage,
  fileFilter,
});
