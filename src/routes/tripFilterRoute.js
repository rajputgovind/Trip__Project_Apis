import express from 'express'
import { createTripFilter, getAllTripFilter } from '../controllers/tripFilterController.js'
import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'

const TripFilterRouter = express.Router()

TripFilterRouter.put("/apply-filter",auth,checkAdmin,createTripFilter)
TripFilterRouter.get("/get-all-filters",getAllTripFilter)


export default TripFilterRouter