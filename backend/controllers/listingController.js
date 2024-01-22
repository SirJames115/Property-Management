import asyncHandler from "express-async-handler";
import Listing from "../models/listingModel.js";
import { errorHandler } from "../utils/error.js";

export const testListing = asyncHandler(async (req, res, next) => {
  try {
    res.status(200).json({ message: "Listing route is working, carry on!" });
  } catch (error) {
    next(error);
  }
});

export const createListing = asyncHandler(async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
});

export const deleteListing = asyncHandler(async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    return next(errorHandler(404, "Listing m=not found!"));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listings"));
  }

  try {
    await listing.findByIdAndDelete(req.params.id);
    res.status(200).json("Listing has been deleted!");
  } catch (error) {
    next(error);
  }
});
