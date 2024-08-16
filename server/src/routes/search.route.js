import express from "express";
import {
  searchPost,
  searchSuggestion,
} from "../controllers/search.controller.js";

const searchRoute = express.Router();

searchRoute.get("/suggestion", searchSuggestion);
searchRoute.get("/", searchPost);

export default searchRoute;
