import AsyncHandler from "express-async-handler";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";

export const test = AsyncHandler(async (req, res) => {
  res.status(200).json({ msg: "Hello test!!" });
});

export const updateUser = AsyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));

  try {
    if (req.body.passwprd) {
      req.body.passwprd = bcryptjs.hashSync(req.body.passwprd, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          avatar: req.body.avatar,
        },
      },
      { new: true },
    );

    const { passwprd, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
});

export const deleteUser = AsyncHandler(async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));

  try {
    await User.findByIdAndDelete(req.params.id);
    res.cookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
});
