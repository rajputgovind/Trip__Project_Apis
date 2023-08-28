import express from 'express'
import { approvedOrganizer } from '../controllers/adminController.js'
import checkAdmin from '../middleware/checkAdmin.js'
import auth from '../middleware/auth.js'
const AdminRouter = express.Router()

AdminRouter.put('/approve-organizer/:id',auth,checkAdmin,approvedOrganizer)

export default AdminRouter