import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import express from "express";

// Function to get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteFile = (fileName, uploadDir) => {
  try {
    const filePath = path.resolve(__dirname, `../../${uploadDir}/${fileName}`);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.error(`File ${filePath} does not exist.`);
    }
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error.message);
  }
};

// Serve static files from the "public" directory
export const serveStaticFiles = (app) => {
  const mediaPath = path.resolve(__dirname, "../../uploads");

  app.use(express.static(mediaPath));
};
