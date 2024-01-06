import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
dotenv.config();
import userRouter from "./routes/userRoute.js";
import authRouth from "./routes/authRouth.js";

import pkg from "colors";
const { Color } = pkg;

const port = process.env.PORT || 5000;

const app = express();

// Will uncomment the DB connection line when I need it, because am not always connected o the internet
connectDB();

app.use(cors());

app.use(express.json());
app.use(express.json({ extended: true }));

app.listen(port, () => {
  console.log(`App running and listening for API calls on port: ${port}`.blue);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouth);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
