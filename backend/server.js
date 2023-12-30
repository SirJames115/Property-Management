import express from "express";
import dotenv from 'dotenv'
// import connectDB from "./config/db.js";
dotenv.config()
import userRouter from './routes/userRoute.js'

import pkg from "colors";
const { Color } = pkg;

const port = process.env.PORT || 5000;

const app = express();

// Will uncomment the DB connection line when I need it, because am not always connected o the internet
// connectDB()

app.listen(port, () => {
  console.log(
    `App running and listening for API calls on port: ${port}`.blue,
  );
});

app.use('/api/user', userRouter)