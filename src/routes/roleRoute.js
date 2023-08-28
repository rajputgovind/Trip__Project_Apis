import express from 'express'
import { getAllRole, postRole } from '../controllers/roleController.js'
import Role from '../models/RoleModel.js'

const RoleRouter = express.Router()

RoleRouter.post("/add-role", postRole)
RoleRouter.get("/get-role",getAllRole)

export default RoleRouter