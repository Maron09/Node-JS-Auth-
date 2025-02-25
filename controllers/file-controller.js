import Image from "../models/image.js";
import uploadToCloudinary from "../helpers/cloudinary_helper.js";
import fs from "fs";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import witTimeout from "../helpers/timeout_helper.js";
import paginationResults from "../helpers/pagination_helper.js";




// const uploadImage = async (req, res) => {
//     try {
//         console.log("Received file:", req.file);
//         // check if it's missing
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Upload a file"
//             })
//         }

//         const file = req.file
//         // upload to cloudinary
//         const { url, publicID } = await uploadToCloudinary(file.path)

//         // store data along with user id in database
//         const newfile = await Image.create({
//             url: url,
//             publicID: publicID,
//             uploadedBy: req.userInfo.userID
//         })

//         if (!newfile) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Failed to upload file, try again"
                
//             })
//         }

//         return res.status(201).json({
//             success: true,
//             message: "File Uploaded successfully",
//             data: newfile
//         })
//     } catch(error) {
//         console.error("Error uploading image", error)

//         res.status(500).json({
//             success: false,
//             message: "InternalServer Error"
//         })
//     }
// }


// const FileController = { uploadImage }



class FileControllers {
    static async uploadImage (req, res) {
        try {
            console.log("Received file:", req.file)
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "upload a file"
                })
            }

            
            const { url, publicID } = await uploadToCloudinary(req.file.path)
            const newImage = await Image.create({
                url: url,
                publicID: publicID,
                uploadedBy: req.userInfo.userID
            })

            if (!newImage) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to upload the file"
                })
            }

            return res.status(201).json({
                success: true,
                message: "File uploaded Successfully",
                data: newImage
            })
        } catch(error) {
            console.error("Error uploading image", error)

            // Handle file cleanup if Cloudinary upload fails
            if (req.file?.path) {
                fs.unlink(req.file.path, (err) => {
                    if (err) {
                        console.error("Failed to delete temp file:", err);
                        
                    }
                })
            }

            res.status(500).json({
                success: false,
                message: "InternalServer Error"
            })
        }
    }

    static async fetchImages (req, res) {
        try {
            // simple pagination logic
            // const page = parseInt(req.query.page) || 1
            // const limit = parseInt(req.query.limit) || 5
            // const skip = (page - 1) * limit 

            // const sortBy = req.query.sortBy || 'createdAt'
            // const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1
            // const totalImages = await Image.countDocuments()
            // const totalPages = Math.ceil(totalImages / limit)

            // const sortObj = {}
            // sortObj[sortBy] = sortOrder

            const totalImages = await Image.countDocuments() //buff pagagination logic
            const { page, limit, skip, totalPages, hasNextPage, hasPrevPage, nextPageUrl, prevPageUrl } = paginationResults(req, totalImages)
            
            const fetchedimgs = await Image.find()
                .sort({createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()

            if (!fetchedimgs || fetchedimgs.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "No images found",
                    totalPages,
                    totalImages,
                    currentPage: page,
                    hasNextPage,
                    hasPrevPage,
                    nextPageUrl,
                    prevPageUrl,
                    data: []
                })
            }

            return res.status(200).json({
                success: true,
                message: "Images Retrieved Successfully",
                totalPages,
                totalImages,
                currentPage: page,
                hasNextPage,
                hasPrevPage,
                nextPageUrl,
                prevPageUrl,
                data: fetchedimgs
            })
        }catch(error) {
            console.error("Error fetching images", error)
            res.status(500).json({
                success: false,
                message: "InternalServer Error"
            })
        }
    }

    static async deleteImageController(req, res) {
        try {
            const {id} = req.params

            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid image ID"
                })
            }

            const userId = req.userInfo.userID
            const image = await Image.findById(id)

            if (!image) {
                return res.status(404).json({
                    success: false,
                    message: "Image Not Found"
                })
            }
            // if the userid in image is equal to the logged in user
            if (image.uploadedBy.toString() !== userId) {
                return res.status(403).json({
                    success: false,
                    message: "You are not Authorized to delete this file"
                })
            }

            // delete form cloudinary
            const cloudinaryResponse = await witTimeout(
                cloudinary.uploader.destroy(image.publicID),
                5000,
                "Cloudinary timeout: Failed to delete image"
            )
            console.log("Cloudinary Delete Response:", cloudinaryResponse); // Debugging

            if (cloudinaryResponse.result !== "ok") {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete image from Cloudinary. Try again later.",
                })
            }

            // delete form database
            await witTimeout(
                Image.findByIdAndDelete(id),
                2000,
                "Database timeout: Failed to delete image"
            );

            return res.status(200).json({
                success: true,
                message: "Image deleted successfully"
            })
        } catch(error) {
            console.error("Error fetching images", error)
            res.status(500).json({
                success: false,
                message: "InternalServer Error"
            })
        }
    }
}

export default FileControllers;
