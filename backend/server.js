import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
dotenv.config();
import userRouter from "./routes/userRoute.js";
import authRouth from "./routes/authRouth.js";
import listingRoute from "./routes/listingRoute.js";
import path from "path";

import pkg from "colors";
const { Color } = pkg;

const port = process.env.PORT || 5000;

const app = express();

// Will uncomment the DB connection line when I need it, because am not always connected o the internet
connectDB();

const __dirname = path.resolve();

app.use(cors());

app.use(express.json());
app.use(express.json({ extended: true }));

app.use(cookieParser());

app.listen(port, () => {
  console.log(`App running and listening for API calls on port: ${port}`.blue);
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouth);
app.use("/api/listing", listingRoute);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get('*', (req,res,next)=>{
  res.send(path.join(__dirname, 'frontend','dist','index.html'))
})

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
