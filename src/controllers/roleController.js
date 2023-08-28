import { StatusCodes } from "http-status-codes";
import Role from "../models/RoleModel.js";

// Create Role Api

export const postRole = async(req,res)=>{
    try {
        const { roleName } = req.body

        if(!roleName){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"Please ensure all fields are filled correctly."})
        }
        const role =new Role({roleName})
        const roleData = await role.save()

        return res.status(StatusCodes.CREATED).json({success:true, message:"The role has been created successfully.", data:roleData})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:true, message:"There was an error while creating the role.", error:error.message})
    }
}

// Get All Roles Api

export const getAllRole = async(req,res)=>{
    try {
        const role = await Role.find({})
        if(!role){
            return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The role could not be found."})
        }
        return res.status(StatusCodes.OK).json({success:true, message:"All roles were found successfully.", data:role})
    } catch (error) {
        console.log(error)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:true, message:"There was an error while trying to find roles."})
    }
}