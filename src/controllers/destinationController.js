import { StatusCodes } from "http-status-codes";
import Destination from "../models/DestinationModel.js";
import errorHandler from "../middleware/validationErrorHandler.js";
import { validationResult } from "express-validator";




// Add Destination Api

export const addDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }


    const images = req.files ? req.files.destinationImage:''
    
    const image = images.map((item)=>{ return item.filename})
    
    const { city, destinationDate, duration, agenda } = req.body;

    const destination = new Destination({
      city,
      destinationDate,
      duration,
      agenda,
      destinationImage: image,
    });
    const destinationData = await destination.save();
    if (!destinationData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "The destination details are incorrect." });
    }
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "The destination has been created.",
      data: destinationData,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: true,
      message: "There was an error while creating the destination.",
      error: error.message,
    });
  }
};



// Edit Destination Api

export const updateDestination = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }
    const destinationId = req.params.id; 
    const images = req.files ? req.files.destinationImage : '';

    let image
    if (images){
     image = images.map((item) => {return item.filename});
    }

    
    const { city, destinationDate, duration, agenda } = req.body;

    const updatedDestinationData = {
      city,
      destinationDate,
      duration,
      agenda,
      destinationImage: image,
    };

    
    const updatedDestination = await Destination.findByIdAndUpdate(
      destinationId,
      updatedDestinationData,
      { new: true }
    );

    if (!updatedDestination) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The destination could not be found." });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "The destination has been updated.",
      data: updatedDestination,
    });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while updating the destination.",
      error: error.message,
    });
  }
};


// Get Single Destination Api

export const getSingleDestination = async(req,res)=>{
  try {
    const destinationId = req.params.id
    const destination = await Destination.findById(destinationId)
    if(!destination){
      return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The destination was not found."})
    }

    return res.status(StatusCodes.OK).json({success:true, message:"The destination was found successfully.",data:destination})
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while trying to find the destination.",
      error: error.message,
  })
}
}
// Delete Destination Api


export const deleteDestination = async(req,res)=>{
  try {
    const id = req.params.id
    const destination = await Destination.findByIdAndDelete(id)
    if(!destination){
      return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "The destination was not found." });
    }
    return res.status(StatusCodes.OK).json({"success":true, message:"The destination has been deleted."})
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while attempting to delete the destination.",
      error: error.message,
    });
  }
}