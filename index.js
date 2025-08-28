import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"

import productRouter from"./routers/productRouter.js"
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv"
import cors from "cors";
import orderRouter from "./routers/orderRouter.js"
import userRouter from "./routers/userRouter.js"
import contactRouter from "./routers/contactRouter.js"
import reviewRouter from "./routers/reviewRouter.js"

dotenv.config()


const app = express()


app.use(bodyParser.json())
app.use(cors())
app.use(
    (req,res,next)=>{

        const value = req.header("Authorization")
        if(value != null){
        const token = value.replace("Bearer ","")
         jwt.verify(token,
            process.env.JWT_SECRET,
            (err,decoded) =>{

                if(decoded == null){
                    res.status(403).json({
                    message : "invalid user"
                })
                }else{
                    req.user = decoded
                    next()
                }
            }

         )
        }else{
        next()//pass the relared one
        }
    }
)


const connectionString = process.env.MONGO_URI


mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database")
    }
).catch(
    ()=>{
        console.log("Failed to connect to the database")
    }
)




app.use("/api/users", userRouter)
app.use("/api/products",productRouter)
app.use("/api/orders", orderRouter)
app.use("/api/contact", contactRouter)
app.use("/api/reviews", reviewRouter)




app.listen(5000, 
   ()=>{
       console.log("server started")
   }
)
