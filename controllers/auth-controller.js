import User from "../models/user.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import "../helpers/env.js"



// const RegisterUser = async (req, res) => {
//     try{
//         // get user info from request body
//         const { firstName, lastName, username, email, password, role } = req.body

//         const existingUser = await User.findOne({$or:[{username}, {email}]})
//         if (existingUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Username or Email already exists"
//             })
//         }
//         // hash user password
//         const salt = await hash.genSalt(10)
//         const hashedPassword = await hash.hash(password, salt)
//         const newUser = new User({
//             firstName,
//             lastName,
//             username,
//             email,
//             password : hashedPassword,
//             role: role || 'user'
//         })
//         await newUser.save()

//         if (!newUser) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Failed to Register User"
//             })
//         }

//         return res.status(201).json({
//             success: true,
//             message: "User Registration Successful",
//             data: newUser
//         })
//     }catch(error) {
//         console.log("Error registering User", error);
        
//         res.status(500).json({
//             success: false,
//             message: "Internal server Error"
//         })
//     }
// }



// const LoginUser = async (req, res) => {
//     try{
//         const { email, password } = req.body

//         if (!email || !password) {
//             return res.status(400).json({
//                 success:false,
//                 message: "Email or password is required"
//             })
//         }
//         const user = await User.findOne({email})
//         if (!user) {
//             return res.status(400).json({
//                 success: false,
//                 message: "User Not Registered"
//             })
//         }

//         // if password is correct
//         const IsPasswordValid = await hash.compare(password, user.password)
//         if (!IsPasswordValid) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid creentials"
//             })
//         }

//         // create user token
//         const accessToken = jwt.sign({
//             userID: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role
//         }, process.env.JWT_SECRET_KEY, {
//             expiresIn: "2h"
//         })


//         return res.status(200).json({
//             success: true,
//             message: "Login Succesfull",
//             data: user.email,
//             access_token: accessToken
//         })
//     }catch(error) {
//         console.log("Errorregistering User", error);
        
//         res.status(500).json({
//             success: false,
//             message: "Internal server Error, Try Again"
//         })
//     }
// }


// const AuthController = { RegisterUser, LoginUser }



// export default AuthController;


class AuthControllers {
    static async RegisterUser(req, res) {
        try {
            const { firstName, lastName, username, email, password, role } = req.body;

            const existingUser = await User.findOne({$or:[{username}, {email}]})

            if (existingUser) {
                return res.status(400).json({
                    success:false,
                    message:"Username or Email already exists"
                })
            }

            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)

            const newUser = await User.create({
                firstName,
                lastName,
                username,
                email,
                password: hashedPassword,
                role: role || 'user'
            })

            if (!newUser) {
                return res.status(400).json({
                    success:false,
                    message:"Failed to Register User"
                })
            }
            return res.status(201).json({
                success: true,
                message: "User Registration Successful",
                data: newUser,
            })
        } catch(error) {
            console.error(error)
            res.status(500).json({
                success:false,
                message: "InternalServer Error"
            })
        }
    }

    static async LoginUser(req, res) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Email or password is required",
                })
            }

            const user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "User Not Registered",
                })
            }

            const IsPasswordValid = await bcrypt.compare(password, user.password)
            if (!IsPasswordValid) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid credentials",
                })
            }

            const accessToken = jwt.sign({
                userID: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }, process.env.JWT_SECRET_KEY, {expiresIn: "2h"})

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                data: { email: user.email },
                access_token: accessToken,
            })
        } catch(error) {
            console.error(error)
            res.status(500).json({
                success:false,
                message: "InternalServer Error"
            })
        }
    }

    static async ChangePassword(req, res) {
        try {
            const userId = req.userInfo.userID

            // get old and new password
            const {oldPassword, newPassword} = req.body
            // find the current logged in user
            const user = await User.findById(userId)
            if (!user) {
                return res.status(400).json({
                    succes: false,
                    message: "user not found"
                })
            }
            // if old password match
            const isPassowrdMatch = await bcrypt.compare(oldPassword, user.password)
            if (!isPassowrdMatch) {
                return res.status(400).json({
                    succes: false,
                    message: "Wrong current Password"
                })
            }
            // hash the new password
            const salt = await bcrypt.genSalt(10)
            const hashedNewPassword = await bcrypt.hash(newPassword, salt)
            
            // update user passowrd
            user.password = hashedNewPassword
            await user.save()

            return res.status(200).json({
                succes: true,
                message: "Password changed successfully"
            })
        }catch(error) {
            console.error(error)
            res.status(500).json({
                success:false,
                message: "InternalServer Error"
            })
        }
    }
}


export default AuthControllers;