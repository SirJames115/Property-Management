import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  testListing,
  updateListing,
} from "../controllers/listingController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", testListing);

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);

export default router;
