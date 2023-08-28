import express from 'express'
import { createTripType, deleteTripType, getAllTripTypes } from '../controllers/tripTypeController.js'
import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'

const TripTypeRouter = express.Router()


TripTypeRouter.post("/create-trip-type",auth,checkAdmin,createTripType)
TripTypeRouter.get("/get-all-trip-types",getAllTripTypes)
TripTypeRouter.delete("/delete-trip-type/:id",auth,checkAdmin,deleteTripType)


export default TripTypeRouter