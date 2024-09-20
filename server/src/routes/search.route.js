import express from "express";
import {
  searchPost,
  searchSuggestion,
  suggestionPostsByCategory,
} from "../controllers/search.controller.js";

const searchRoute = express.Router();

searchRoute.get("/suggestion", searchSuggestion);
searchRoute.get("/", searchPost);
searchRoute.get("/suggestion-posts-by-category", suggestionPostsByCategory);

export default searchRoute;
