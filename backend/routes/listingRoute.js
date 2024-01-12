import express from "express";
import {
  createListing,
  testListing,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", testListing);

router.post("/create", verifyToken, createListing);

export default router;
