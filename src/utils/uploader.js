import __dirname from "./index.js";
import multer from 'multer';

const multerSelection = (opts) => {
    const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,`${__dirname}/../public/${opts.carpet}`)
        },
        filename:function(req,file,cb){
            cb(null,`${Date.now()}-${file.originalname}`)
        }
    })
    const uploader = multer({storage})
    return uploader
}

const uploaderImg = multerSelection({carpet:"img"});
const uploaderDocument = multerSelection({carpet:"documents"});

export {uploaderImg,uploaderDocument};