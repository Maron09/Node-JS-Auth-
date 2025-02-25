import express from "express";
import AuthController from "../controllers/auth-controller.js";
import AuthMiddleware from "../middleware/auth-middleware.js";

const router = express.Router()



router.post('/register', AuthController.RegisterUser)
router.post('/login', AuthController.LoginUser)
router.post('/change_password', AuthMiddleware.VerifyToken, AuthController.ChangePassword)



export default router;