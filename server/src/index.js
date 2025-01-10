import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import router from "./routes/index.js";
import { serveStaticFiles } from "./utils/Files.js";
import { app, server } from "./socket/index.js";
import morgan from "morgan";
import compression from "compression";

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8800;

// Configure middleware
const configureMiddleware = () => {
  // Parse cookies
  app.use(cookieParser());

  // Enable response compression
  app.use(
    compression({
      level: 6, // Compression level (1-9)
      threshold: 1024, // Compress responses larger than 1KB
      filter: (req, res) => {
        const contentType = res.getHeader("Content-Type");
        if (contentType && contentType.includes("text")) {
          return true;
        }
        return compression.filter(req, res);
      },
    })
  );

  // Enable CORS with specific options
  app.use(cors(getCorsOptions()));

  // Parse JSON and URL-encoded data
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Initialize Passport.js for authentication
  app.use(passport.initialize());

  // Log HTTP requests
  app.use(morgan("dev"));

  // Serve static files
  serveStaticFiles(app);
};

// CORS options
const getCorsOptions = () => ({
  origin: [process.env.CREATOR_HOST, process.env.CLIENT_HOST],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
});

// Start the server
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
};

// Main function
const main = async () => {
  try {
    // console.log("🚀 Connecting to the database...");
    await dbConnection(); // Database connection

    // console.log("⚙️ Configuring middleware...");
    configureMiddleware(); // Initialize middleware

    // console.log("🔗 Setting up routes...");
    app.use("/api/v1", router); // Set up API routes

    // console.log("🎉 Starting the server...");
    startServer(); // Start the server
  } catch (error) {
    // console.error("❌ Error starting the server:", error);
    process.exit(1); // Exit the process with failure code
  }
};

// Execute the main function
main();
