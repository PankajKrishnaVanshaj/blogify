import express from "express";
import {
  createWebStory,
  getAllWebStories,
  getWebStoryById,
  updateWebStory,
  deleteWebStory,
  getWebStoryByCreator,
  suggestionWebStoryByCategory,
  getSitemapWebStories,
} from "../controllers/webStory.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const webStoryRoute = express.Router();

// Define routes
webStoryRoute.get("/all", getAllWebStories); // Public route
webStoryRoute.get("/:id", getSitemapWebStories); // Public route
webStoryRoute.get("/sitemap-web-stories", getWebStoryById); // Public route
// webStoryRoute.get("/category", suggestionWebStoryByCategory); // Public route
webStoryRoute.get("/",authMiddleware,  getWebStoryByCreator); // Protected route
webStoryRoute.post("/", authMiddleware, createWebStory); // Protected route
webStoryRoute.put("/:id", authMiddleware, updateWebStory); // Protected route
webStoryRoute.delete("/:id", authMiddleware, deleteWebStory); // Protected route

export default webStoryRoute;
