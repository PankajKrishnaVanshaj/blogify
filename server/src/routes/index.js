import { Router } from "express";

import authRoute from "./auth.route.js";
import postRoute from "./post.route.js";
import userRoute from "./user.route.js";
import commentRouter from "./comment.route.js";
import searchRoute from "./search.route.js";
import bookMarkRouter from "./bookMark.router.js";
import messageRouter from "./message.routes.js";
import conversationRouter from "./conversation.routes.js";
import mediaRoute from "./media.route.js";
import webStoryRoute from "./webStory.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/posts", postRoute);
router.use("/web-stories", webStoryRoute);
router.use("/medias", mediaRoute);
router.use("/users", userRoute);
router.use("/comments", commentRouter);
router.use("/search", searchRoute);
router.use("/bookmark", bookMarkRouter);
router.use("/message", messageRouter);
router.use("/conversation", conversationRouter);

export default router;
