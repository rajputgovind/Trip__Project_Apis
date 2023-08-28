import { StatusCodes } from "http-status-codes";
import Role from "../models/RoleModel.js";
import User from "../models/UserModel.js";
import Trip from "../models/TripModel.js";
import mongoose from "mongoose";
import JoiningRequest from "../models/JoiningRequestModel.js";
import Sib from "sib-api-v3-sdk";
import moment from "moment";

// Get All Organizer Api

export const getAllOrganizers = async (req, res) => {
  try {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const organizerId = await Role.findOne({ roleName: "Organizer" });

    let matchOptions = {
      role: organizerId._id,
      isDeleted: false,
      $or: [
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { email: { $regex: ".*" + search + ".*", $options: "i" } },
      ],
    };
    const organizers = User.aggregate([
      {
        $match: matchOptions,
      },
      {
        $lookup: {
          from:"roles",
          localField:"role",
          foreignField:"_id",
          as:"role"
        }
      }
    ]);

    const data = await User.aggregatePaginate(organizers, { page, limit });

    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The organizers could not be found." });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "All organizers were found successfully.",
      data: data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while attempting to find all organizers.",
      error: error.message,
    });
  }
};

// Get Single Organizer Api

export const getSingleOrganizer = async (req, res) => {
  try {
    const Organizer = await User.findById(req.params.id).populate('role');
    if (!Organizer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The organizer does not exist." });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "The organizer was found successfully.",
      data: Organizer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "There was an error while trying to find the single organizer.",
      error: error.message,
    });
  }
};


// Particular Organizer's Trip Api


export const getAllTripOfOrganizer = async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const trips =  Trip.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $lookup: {
          from: "users",
          foreignField: "_id",
          localField: "user",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "destinations",
          localField: "destination",
          foreignField: "_id",
          as: "destination",
        },
      },
      {
        $lookup: {
          from: "documents",
          localField: "document",
          foreignField: "_id",
          as: "document",
        },
      },
      {
        $unwind: { path: "$document", preserveNullAndEmptyArrays: true },
      },
    ])
    const data = await Trip.aggregatePaginate(trips, { page, limit })
    if(!data){
    return  res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The trips could not be found."})
    }
    return res.status(StatusCodes.OK).json({success:true, message:"The trips were found successfully.",data:data})
  } catch (error) {
    console.log(error)
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "There was an error while attempting to find all trips of the organizer.",
        error: error.message,
      });
  }
}


// Update Joining Request Api

export const updateJoiningRequest = async(req,res)=>{
  try {
      const status= req.body.status
      const id = req.params.id
      const joiningRequest = await JoiningRequest.findById(id).populate('user').populate('trip')

      if(!joiningRequest){
        return res.status(StatusCodes.NOT_FOUND).json({success:false, message:"The joining request could not be found."})
      }

      // console.log(joiningRequest)
      const organizer  =await User.findById(joiningRequest.trip.user)

      if(organizer){
        joiningRequest.status = status
        
        const originalDate = new Date(joiningRequest.trip.tripDate);
        const formattedDate = moment(originalDate).format('MMMM DD, YYYY');

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.API_KEY;
        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
          email: organizer.email,
          name: `Hii ${organizer.email}`,
        };

        const receivers = [
          {
            email: joiningRequest.user.email,
          },
        ];

        let emailResult = await tranEmailApi.sendTransacEmail({
          sender,
          to: receivers,
          subject: `Trip Request ${status}`,
        textContent: `Hello ${joiningRequest.user.email},\n\nYour trip request has been ${status}.`,
        htmlContent: `
        <div style="font-family: Arial, sans-serif;">
        <h2>Trip Request ${status}</h2>
        <p>Hello ${joiningRequest.user.name},</p>
        <p>Your trip request has been ${status}.</p>
        <p>Trip Details:</p>
        <ul>
          <li><strong>Trip Date:</strong> ${formattedDate}</li>
          <li><strong>Organizer:</strong> ${organizer.name}</li>
          <li><strong>Trip Duration:</strong> ${joiningRequest.trip.tripDuration}</li>
        </ul>
        <p>Have a great trip!</p>
        <p>Best regards,</p>
        <p>Your Trip Organizer Team</p>
      </div>
    `,
    params: {
      role: "Frontend",
    },
      });

      await joiningRequest.save()
      
      return res.status(StatusCodes.OK).json({success:true, message:"The joining request has been updated.", data:joiningRequest})
    }


  } catch (error) {
      console.log(error)
      return res.status(StatusCodes.OK).json({success:false, message:"There was an error while updating the joining request.",error: error.message,})
  }
}