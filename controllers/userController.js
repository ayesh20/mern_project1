import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export function createUser(req,res){


    const passwordHash = bcrypt.hashSync(req.body.password,10)
    


    const userData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        phone: req.body.phone || "NOT GIVEN",
        password : passwordHash,
    }

    const user = new User(userData)

    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Failed to create user"
            })
        }
    )
}

export function loginuser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email : email
        }
    ).then(
        (user)=>{
            if(user == null){
                res.status(404).json({
                    message : "user not found"
                })
            }
            else{
                const ispasswordcorrect = bcrypt.compareSync(password,user.password)
                if(ispasswordcorrect){

                    const token = jwt.sign(
                        {
                            email : user.email,
                            firstName : user.firstName,
                            lastName : user.lastName,
                            role : user.role,
                            isblocked : user.isBlocked,
                            isemailverify : user.isEmailVerified,
                            image : user.image
                        },
                        process.env.JWT_SECRET,
                    )
                    res.json({
                        token : token,
                        message : "loging successfully"
                    })
                }
                else{
                    res.status(403).json({
                    message : "incorrect password"
                })
                }
            }
        }
    )
}

export async function getUsers(req, res) {
    const page = parseInt(req.params.page) || 1;
    const limit = parseInt(req.params.limit) || 10;

    try {
        if (isAdmin(req)) {
            const userCount = await User.countDocuments();
            const totalPages = Math.ceil(userCount / limit);

            const users = await User.find()
                .skip((page - 1) * limit)
                .limit(limit);

            return res.json({
                users,
                totalPages,
            });
        } else {
            return res.status(403).json({ message: "Unauthorized access" });
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: "Failed to fetch users" });
    }
}



export function isAdmin(req){
    
    if(req.user == null){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
}
