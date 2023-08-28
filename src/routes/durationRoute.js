import express from 'express'
import auth from '../middleware/auth.js'
import checkAdmin from '../middleware/checkAdmin.js'
import { createDuration, deleteDuration, getAllDurations } from '../controllers/durationController.js'

const DurationRouter = express.Router()


DurationRouter.post("/create-duration",auth,checkAdmin,createDuration)
DurationRouter.get("/get-all-durations",getAllDurations)
DurationRouter.delete("/delete-duration/:id",auth,checkAdmin, deleteDuration)

export default DurationRouter