import { StatusCodes } from "http-status-codes";
import JoiningRequest from "../models/JoiningRequestModel.js";
import mongoose from "mongoose";
import JoiningRequestMetaData from "../models/JoiningRequestMetaData.js";



// Create Joining request Api


export const createJoiningRequest = async (req, res) => {
  try {

    const joiningRequest = await JoiningRequest.findOne({trip:req.body.tripId,user:req.user._id})
    // console.log(joiningRequest)
    if(joiningRequest){
      return res.status(StatusCodes.BAD_REQUEST).json({success:false,message:"You have already submitted a joining request for this trip."})
    }

    const fields = req.body.fields;

    function isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    }

    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const value = fields[key];

        if (!value) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Value for key '${key}' is missing.`,
          });
        }

        if (key === 'email' && !isValidEmail(value)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Invalid email address format for key 'email'.`,
          });
        }
      }
    }

    const newJoiningRequest = new JoiningRequest({
      user: req.user._id,
      trip: req.body.tripId,
      // status:req.body.status
    });

    
    const savedJoiningRequest = await newJoiningRequest.save();
    // console.log(req.body, "req");

    let metaData
    for (const key in fields) {
      if (fields.hasOwnProperty(key)) {
        const value = fields[key];

        if (!value) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: `Value for key '${key}' is missing.`,
          });
        }
        
         metaData = new JoiningRequestMetaData({
          joining: savedJoiningRequest._id,
          key: key,
          value: fields[key],
        });
        await metaData.save();
      }
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "The joining request has been created.",
      data: metaData,
    });

  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while creating the joining request.",
      error: error.message,
    });
  }
};


// Upload File Api

export const uploadFile = async(req,res)=>{
  try {
    const image = req.file? req.file.filename :''
    const tripId = req.params.id
    const trip = await JoiningRequest.findOne({trip:tripId, user:req.user._id})

    if(!trip){
      return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The trip could not be found."})
    }
    if(trip.uploadImage!==""){
      return res.status(StatusCodes.BAD_REQUEST).json({success:false, message:"The file has already been uploaded."})
    }
    trip.uploadImage = image

    await trip.save()

    return res.status(StatusCodes.OK).json({success:true, message:"The image has been uploaded successfully.", data:trip})

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"There was an error while uploading the file."})
  }
}



// Get All Request Of User

export const getAllJoiningRequestOfUser = async(req,res)=>{
  try {
    const userId = req.user._id
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // const joiningRequest =await JoiningRequest.find({user:userId}).populate('trip').populate('user')

    const joiningRequest = JoiningRequest.aggregate([
      {
        $match:{ user: new mongoose.Types.ObjectId(userId)}
      },{
        $lookup:{
          from:'users',
          localField:"user",
          foreignField:"_id",
          as:"user"
        }
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
        {
          $lookup:{
            from:'trips',
            localField:"trip",
            foreignField:"_id",
            as:"trip"
          }
        },
        {
          $unwind: { path: "$trip", preserveNullAndEmptyArrays: true },
        },
        {
          $lookup:{
            from:'destinations',
            localField:"trip.destination",
            foreignField:"_id",
            as:"destination"
          }
        },  {
          $addFields: {
            'trip.destination': '$destination'
          }
        },
        {
          $project: {
            destination: 0
          }
        }
       
        
    ])
    const data = await JoiningRequest.aggregatePaginate(joiningRequest, { page, limit });
    if(!data){
      return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The joining request could not be found."})
    }
    return res.status(StatusCodes.OK).json({success:true, message:"Find all joining request of user",data:data})
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"There was an error while trying to find the joining requests."})
  }
}


// Delete Joining Request Api


export const deleteJoiningRequest = async(req,res)=>{
  try {
    const joiningRequest = await JoiningRequest.findByIdAndDelete(req.params.id)
    if(!joiningRequest){
      return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The joining request could not be located."})
    }
    return res.status(StatusCodes.OK).json({success:true,message:"The joining request has been deleted."})
  } catch (error) {
    console.log(error)
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({success:false, message:"There was an error while deleting the joining request.", error: error.message})
  }
} 