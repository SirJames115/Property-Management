import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'

export const authController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

//   
const emailExists = await User.findOne({email})
const usernameExixts = await User.findOne({username})

if(emailExists){
    res.send({
        Message: `The user with the email ${email} already exists`
    })
    console.log(`The user with the email ${email} already exists`);
}
if(usernameExixts){
    res.send({
        Message: `The user with the username ${username} already exists`
    })
    console.log(`The user with the username ${username} already exists`);
}
// 

const hashedPassword = await bcryptjs.hash(password, 10)


  const newUser = await new User({ username, email, password: hashedPassword });
  try {
  await newUser.save();
     res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({
        Error: error
    })
  }

 
});
