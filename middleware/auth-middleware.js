import jwt from "jsonwebtoken"
import "../helpers/env.js"


class AuthMiddleware {
    static VerifyToken (req, res, next) {
        const authHeader = req.headers["authorization"]
        
        const token = authHeader && authHeader.split(" ")[1]

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Valid Token is required"
            })
        }

        // decode token
        try{
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            
            

            req.userInfo = decodedToken

            next();
        }catch(error) {
            return res.status(500).json({
                success: false,
                message: "Valid Token is required, Login to continue"
            })
        }
    }

    static IsAdmin (req, res, next) {
        if (req.userInfo?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied, Admins only"
            })
        }
        next();
    }
}

export default AuthMiddleware;


