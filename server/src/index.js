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

// Load environment variables
dotenv.config();
const PORT = process.env.PORT || 8800;

// Middleware configuration
const configureMiddleware = () => {
  app.use(cookieParser());
  app.use(cors(getCorsOptions()));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(morgan("dev"));
  serveStaticFiles(app);
};

// CORS options configuration
const getCorsOptions = () => ({
  origin: [process.env.CREATOR_HOST, process.env.CLIENT_HOST],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 200,
});

// Start the Express server
const startServer = () => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Main function to bootstrap the application
const main = async () => {
  try {
    await dbConnection(); // Connect to the database
    configureMiddleware(); // Initialize middleware
    app.use("/api/v1", router); // Set up routes
    startServer(); // Start the server
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Execute main function
main();
