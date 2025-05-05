import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(cors());

export default app;
