import express from "express";
import dotenv from 'dotenv'
dotenv.config()

import pkg from "colors";
const { Color } = pkg;

const port = process.env.PORT || 5000;

const app = express();

app.listen(port, () => {
  console.log(
    `App running and listening for API calls on port: ${port}`.blue,
  );
});
