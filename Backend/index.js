import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));
app.use(router);

export default app;
