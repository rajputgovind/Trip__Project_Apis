import express from 'express'
import { createJoiningRequest, deleteJoiningRequest ,getAllJoiningRequestOfUser, uploadFile} from '../controllers/joiningRequestController.js'
import auth from '../middleware/auth.js'
import checkOrganizer from '../middleware/checkOrganizer.js'
import { fileURLToPath } from 'url';
import path from 'path'
import multer from 'multer';

const JoiningRequestRouter = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageLocation = path.join(__dirname,"../../public/uploadImages")

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        return cb(null,imageLocation,function(error,success){
            if(error) throw error
        })
    },
    filename:function(req,file,cb){
        const fname = Date.now()+"-"+file.originalname
        return cb(null, fname, function(error,success){
            if(error) throw error
        })
    }


})

const upload = multer({storage:storage})



JoiningRequestRouter.post('/create-joining-request',auth,createJoiningRequest)

JoiningRequestRouter.get('/get-all-joining-request',auth, getAllJoiningRequestOfUser)

JoiningRequestRouter.delete('/delete-joining-request/:id', auth,deleteJoiningRequest)

JoiningRequestRouter.post('/upload-image/:id',upload.single('uploadImage'),auth,uploadFile)

export default JoiningRequestRouter



