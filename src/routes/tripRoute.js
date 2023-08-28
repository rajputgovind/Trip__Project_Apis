import express from 'express'
import {  createTrip, deleteTrip, getAllTrips, getSingleTrip, updateTrip } from '../controllers/tripController.js'
import multer from 'multer'
import { fileURLToPath } from 'url';
import path from 'path'
import auth from '../middleware/auth.js';
import checkOrganizer from '../middleware/checkOrganizer.js';
import { validateTrip, validateUpdateTrip } from '../middleware/validate.js';

const TripRouter = express.Router()

// Image Upload Code

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageLocation = path.join(__dirname,"../../public/tripImages")

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

TripRouter.post("/create-trip",upload.single('mainTripImage'),auth,checkOrganizer,validateTrip,createTrip)

TripRouter.get('/get-all-trips',getAllTrips)

TripRouter.get('/get-single-trip/:id', getSingleTrip)

TripRouter.delete("/delete-trip/:id",auth,checkOrganizer, deleteTrip)

TripRouter.put("/update-trip/:id",upload.single('mainTripImage'),auth,checkOrganizer,validateUpdateTrip, updateTrip)


export default TripRouter