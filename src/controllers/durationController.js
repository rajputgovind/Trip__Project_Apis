import { StatusCodes } from "http-status-codes";
import Duration from "../models/DurationModel.js";


// Create Price Api

export const createDuration = async(req,res)=>{
    try {
        
        const duration =new Duration({duration:req.body.duration}) 
        const durationData = await duration.save()

        if(!durationData){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false, message:"Duration not found"})
        }
        return res.status(StatusCodes.CREATED).json({success:true, message:"Duration created" , data:durationData})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while create duration"})
    }
}


// Get All Price Api

export const getAllDurations = async(req,res)=>{
    try {
        const duration = await Duration.find({})
        if(!duration){
            return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"Duration not found"})
        }
        return res.status(StatusCodes.OK).json({success:true, message:"All Durations fetch successfully", data:duration})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while fetch Durations"})
    }
}


// Delete Duration Api

export const deleteDuration = async(req,res)=>{
    try {
        const duration = await Duration.findByIdAndDelete(req.params.id)
        if(!duration){
            return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"Duration not found"})
        }
        return res.status(StatusCodes.OK).json({success:true, message:"Duration deleted"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while delete duration"})
    }
}