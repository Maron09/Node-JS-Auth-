import express from "express"
import AuthMiddleware from "../middleware/auth-middleware.js"



const adminRoute = express.Router()



adminRoute.get('/welcome', AuthMiddleware.VerifyToken, AuthMiddleware.IsAdmin, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to the admin page"
    })
})


export default adminRoute;