import AsyncHandler from "express-async-handler";

export const test = AsyncHandler(async(req,res)=>{
    res.status(200).json({msg: 'Hello test!!'})

})