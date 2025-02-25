import express from "express"
import AuthMiddleware from "../middleware/auth-middleware.js"



const homeRouter = express.Router()



homeRouter.get('/welcome', AuthMiddleware.VerifyToken, (req, res) => {
    const { username, userID, email, role } = req.userInfo
    res.status(200).json({
        success: true,
        message: "Welcome to the home Page",
        user: {
            _id: userID,
            username: username,
            email: email,
            role: role
        }
    })
})



export default homeRouter;