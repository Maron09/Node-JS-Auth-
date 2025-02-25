import express from "express"
import FileController from "../controllers/file-controller.js"
import AuthMiddleware from "../middleware/auth-middleware.js"
import uploadMiddleware from "../middleware/upload-middleware.js"

const fileRoute = express.Router()



fileRoute.post(
    '/upload', 
    AuthMiddleware.VerifyToken, 
    AuthMiddleware.IsAdmin,
    uploadMiddleware,
    FileController.uploadImage
)


fileRoute.get(
    '/images',
    // AuthMiddleware.VerifyToken,
    // AuthMiddleware.IsAdmin,
    FileController.fetchImages
)

fileRoute.delete(
    '/delete_image/:id',
    AuthMiddleware.VerifyToken,
    AuthMiddleware.IsAdmin,
    FileController.deleteImageController
)



export default fileRoute;

