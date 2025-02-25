import mongoose from "mongoose"


const { Schema, model } = mongoose

const imageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    publicID: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true})

const Image = model('Image', imageSchema)


export default Image;