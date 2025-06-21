import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import studentRouter from "./routers/studentRouter.js "
import userRouter from "./Routers/userrouter.js"
import jwt, { decode } from "jsonwebtoken";


const app = express()


app.use(bodyParser.json())

app.use(
    (req,res,next)=>{

        const value = req.header("Authorization")
        if(value != null){
        const token = value.replace("Bearer ","")
         jwt.verify(token,
            "cbc-6503",
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


const connectionString = "mongodb+srv://admin:123@cluster0.aaydtkx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database")
    }
).catch(
    ()=>{
        console.log("Failed to connect to the database")
    }
)




app.use("/students",studentRouter)
app.use("/users", userRouter)




app.listen(5000, 
   ()=>{
       console.log("server started")
   }
)
