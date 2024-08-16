import { Router } from "express";

import authRoute from "./auth.route.js";
import postRoute from "./post.route.js";
import userRoute from "./user.route.js";
import commentRouter from "./comment.route.js";
import searchRoute from "./search.route.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/posts", postRoute);
router.use("/users", userRoute);
router.use("/comments", commentRouter);
router.use("/search", searchRoute);

export default router;
