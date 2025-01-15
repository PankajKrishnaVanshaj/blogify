import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../config/multer.js";
import mediaController from "../controllers/media.controller.js";

const mediaRoute = express.Router();

mediaRoute.post(
  "/upload-media",
  authMiddleware,
  upload.single("media"),
  mediaController.uploadMedia
);
mediaRoute.put(
  "/edit-media/:id",
  authMiddleware,
  upload.single("media"),
  mediaController.updateMedia
);

mediaRoute.get(
  "/all-medias-of-creator",
  authMiddleware,
  mediaController.getMediasByCreator
);
mediaRoute.get("/media/:id", mediaController.getMediaById);
mediaRoute.get("/get-all-medias", mediaController.getAllMedias);


// Route for deleting media
mediaRoute.delete("/media/:id", authMiddleware, mediaController.deleteMedia); // Handle deleting a media

export default mediaRoute;
