import { StatusCodes } from "http-status-codes";
import Price from "../models/PriceModel.js";


// Create Price Api

export const createPrice = async(req,res)=>{
    try {
        
        const price =new Price({price:req.body.price}) 
        const priceData = await price.save()

        if(!priceData){
            return res.status(StatusCodes.BAD_REQUEST).json({success:false, message:"Price not found"})
        }
        return res.status(StatusCodes.CREATED).json({success:true, message:"Price created" , data:priceData})

    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while create price"})
    }
}


// Get All Price Api

export const getAllPrices = async(req,res)=>{
    try {
        const price = await Price.find({})
        if(!price){
            return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"Price not found"})
        }
        return res.status(StatusCodes.OK).json({success:true, message:"All Prices fetch successfully", data:price})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while fetch prices"})
    }
}


// Delete Price Api

export const deletePrice = async(req,res)=>{
    try {
        const price = await Price.findByIdAndDelete(req.params.id)
        if(!price){
            return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"Price not found"})
        }
        return res.status(StatusCodes.OK).json({success:true, message:"Price deleted"})
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"Error while delete prices"})
    }
}

