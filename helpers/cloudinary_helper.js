import cloudinary from "../config/cloudinary.js";


const uploadToCloudinary = async (filePath) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(
            filePath,
            {
                quality: "auto", 
                fetch_format: "auto",
                transformation: [{ width: 800, height: 600, crop: "limit" }],
                timeout: 120000
            }
        )
        

        return {
            url: uploadResult.secure_url,
            publicID: uploadResult.public_id,
            type: uploadResult.resource_type
        }
    }catch(error) {
        console.error("Error Uploading to cloudinary", error)
        if (error.name === "TimeoutError") {
            throw new Error("Cloudinary request timed out. Try again.");
        }

        throw new Error(error.message || "Error Uploading to Cloudinary");
    }
}



export default uploadToCloudinary;