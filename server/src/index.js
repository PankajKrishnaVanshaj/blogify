import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import dbConnection from "./config/db.js";
import router from "./routes/index.js";
import { serveStaticFiles } from "./utils/Files.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8800;

const corsOptions = {
  origin: [process.env.CREATOR_HOST, process.env.CLIENT_HOST],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

serveStaticFiles(app);

app.use("/api/v1", router);

dbConnection().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
  });
});
