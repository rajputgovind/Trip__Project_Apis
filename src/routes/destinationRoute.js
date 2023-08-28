import express from 'express'
import { addDestination, deleteDestination, getSingleDestination, updateDestination } from '../controllers/destinationController.js'
import multer from 'multer'
import { fileURLToPath } from 'url';
import path from 'path'
import { validateDestination, validateUpdateDestination } from '../middleware/validate.js';
import auth from '../middleware/auth.js';
import checkOrganizer from '../middleware/checkOrganizer.js'


const DestinationRouter = express.Router()

// Image Upload Code

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageLocation = path.join(__dirname,"../../public/destinationImages")

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

DestinationRouter.post("/add-destination",upload.fields([{name:'destinationImage' }]),auth,checkOrganizer,validateDestination,addDestination)

DestinationRouter.put("/update-destination/:id",upload.fields([{name:'destinationImage' }]),auth,checkOrganizer,validateUpdateDestination,updateDestination)

DestinationRouter.delete("/delete-destination/:id",auth,checkOrganizer,deleteDestination)

DestinationRouter.get("/get-destination/:id",getSingleDestination)


export default DestinationRouter ;