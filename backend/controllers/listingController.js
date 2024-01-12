import asyncHandler from "express-async-handler";
import Listing from "../models/listingModel.js";

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
  } catch (error) {}
});
