import multer from "multer"
import path from "path"




// // set multer storage
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function(req, file, cb) {
//         cb(
//             null,
//             file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//         )
//     }
// })


// // file filter function
// const checkFileFilter = (req, file, cb) => {
//     if (!file.mimetype.startsWith('image')) {
//         return cb(new Error('Not an Image! Please Upload only Image'))
//     }
//     cb(null, true)
// }


// // multer middleware
// const uploadMiddleware = multer({
//     storage: storage,
//     fileFilter: checkFileFilter,
//     limits: {
//         fieldSize: 5 * 1024 *1024
//     }
// }).single('image')

// export default uploadMiddleware;

class UploadMiddleware {
    static storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },
        filename: (req, file, cb) => {
            cb(
                null,
                file.fieldname + "-" + Date.now() + path.extname(file.originalname)
            )
        }
    })

    static checkFileFilter = (req, file, cb) => {
        if (!file.mimetype.startsWith('image')) {
            return cb(new Error('Not an Image! Please Upload only Image'))
        }
        cb(null, true)
    }

    static upload = multer({
        storage: UploadMiddleware.storage,
        fileFilter: UploadMiddleware.checkFileFilter,
        limits: {
            fieldSize: 5 * 1024 *1024
        }
    }).single('image')


    static getMiddleware() {
        return UploadMiddleware.upload
    }
}

export default UploadMiddleware.getMiddleware()