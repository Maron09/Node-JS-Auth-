import mongoose from "mongoose";
import "../helpers/env.js";


const Connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000, 
            socketTimeoutMS: 45000,
        })
        console.log("MongoDB connected Successfully");
        
    } catch(error) {
        console.error("Failed to connect to DataBase");
        process.exit(1)
    }
}


export default Connect;