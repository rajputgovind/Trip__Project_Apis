import { StatusCodes } from "http-status-codes";
import Trip from "../models/TripModel.js";
import Destination from "../models/DestinationModel.js";
import User from "../models/UserModel.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import errorHandler from "../middleware/validationErrorHandler.js";

// const exchangeRate = 0.05
// Create Trip Api

export const createTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

    const image = req.file ? req.file.filename : "";
    // const tripPrice = req.body.tripPrice;
    // const saudiRiyals = tripPrice * exchangeRate;
    const {
      country,
      tripDate,
      tripDuration,
      tripIncludes,
      tripPrice,
      groupType,
      tripType,
      tripName,
      contactName,
      contactPhone,
      contactEmail,
      destination,
      document,
    } = req.body;
    // console.log(req.body,"destination1");

    const newTrip = new Trip({
      country,
      tripDate,
      tripDuration,
      tripIncludes,
      mainTripImage: image,
      tripPrice,
      groupType,
      tripType,
      tripName,
      contactName,
      contactPhone,
      contactEmail,
      destination: destination,
      document,
      user: req.user._id,
    });
    // console.log(newTrip,"destination2");

    const data = new FormData();
    destination.forEach((item) => {
      data.append(`destination[]`, JSON.stringify(item));
    });

    const savedTrip = await newTrip.save();
    // console.log(data.getAll('destination[]'));
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "The trip has been created.",
      data: { trip: savedTrip },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: true,
        message: "There was an error while creating the trip.",
        error: error.message,
      });
  }
};

// Fetch All Trip Api

export const getAllTrips = async (req, res) => {
  try {
    const minPrice =Number(req.query.minPrice)
    const maxPrice =Number(req.query.maxPrice)
    // const price 
    const duration = req.query.duration;
    const groupType = req.query.groupType;
    const tripType = req.query.tripType;
    const search = req.query.search;
    // const email = req.query.email;

    // console.log(price, duration, groupType, tripType);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const options = [];

    if (minPrice && maxPrice) {
      options.push({ tripPrice: { $gte: minPrice, $lte: maxPrice } });
    }
    if (duration) {
      options.push({ tripDuration:duration });
    }
    if (groupType) {
      options.push({ groupType });
    }
    if (tripType) {
      options.push({ tripType });
    }
    if (search) {
      options.push({ $or :[{
        "user.name": { $regex: ".*" + search + ".*", $options: "i" }},
        {"user.email": { $regex: ".*" + search + ".*", $options: "i" }}]
      });
    }
    // if (email) {
    //   options.push({
    //     "user.email": { $regex: ".*" + email + ".*", $options: "i" },
    //   });
    // }
    let matchOptions = {};
    if (options.length) {
      matchOptions = {
        $and: options,
      };
    }

    const trips = Trip.aggregate([
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
        $match: matchOptions,
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
        
      },{
        $unwind: { path: "$document", preserveNullAndEmptyArrays: true },
      },
    ]);
    const data = await Trip.aggregatePaginate(trips, { page, limit });
    if (!data) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The trips could not be found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All trips were found successfully.",
        data: data,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "There was an error while trying to find all trips.",
        error: error.message,
      });
  }
};

// Fetch Single Trip Api

// export const getSingleTrip = async (req, res) => {
//   try {
//     const id = req.params.id;

//     const trip = await Trip.aggregate([
//       {
//         $match: { _id: new mongoose.Types.ObjectId(id) },
//       },
//       {
//         $lookup: {
//           from: "users",
//           foreignField: "_id",
//           localField: "user",
//           as: "user",
//         },
//       },
//       {
//         $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
//       },
//       {
//         $lookup: {
//           from: "destinations",
//           localField: "destination",
//           foreignField: "_id",
//           as: "destination",
//         },
//       },
//       {
//         $lookup: {
//           from: "documents",
//           localField: "document",
//           foreignField: "_id",
//           as: "document",
//         },
//       },
//       {
//         $unwind: { path: "$document", preserveNullAndEmptyArrays: true },
//       },
//       {
//         $lookup: {
//           from: "joiningrequests",
//           localField: "_id",
//           foreignField: "trip",
//           as: "joiningRequests",
//         },
//       },{
//         $lookup: {
//           from: "joiningrequests",
//           let: { tripId: "$_id" },
//           pipeline: [
//             {
//               $match: {
//                 $expr: { $eq: ["$trip", "$$tripId"] },
//               },
//             },
//             {
//               $lookup: {
//                 from: "users",
//                 localField: "user",
//                 foreignField: "_id",
//                 as: "userDetails",
//               },
//             },
//             {
//               $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
//             },
//             {
//               $sort: { createdAt: -1 } // Sort by date in descending order
//             }
//           ],
//           as: "joiningRequests",
//         }, },
//     ]);

//     if (!trip) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ success: false, message: "Trip not found" });
//     }
//     // const singleTrip = trip[0]

//     return res
//       .status(StatusCodes.OK)
//       .json({ success: true, message: "Trip find successfully", data: trip });
//   } catch (error) {
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({
//         success: false,
//         message: "Error while find single trip",
//         error: error.message,
//       });
//   }
// };

export const getSingleTrip = async (req, res) => {
  try {
    const id = req.params.id;

    const trip = await Trip.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(id) },
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
      {
        $lookup: {
          from: "joiningrequests",
          localField: "_id",
          foreignField: "trip",
          as: "joiningRequests",
        },
      },
      {
        $lookup: {
          from: "joiningrequests",
          let: { tripId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$trip", "$$tripId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            {
              $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true },
            },
            {
              $sort: { createdAt: -1 } // Sort by date in descending order
            }
          ],
          as: "joiningRequests",
        }, },
        {
          $lookup: {
            from: "joiningrequestmetadatas", // Use the correct collection name
            localField: "joiningRequests._id", // Joining request ID
            foreignField: "joining",
            as: "joiningrequestmetadata",
          },
        },
        // Merge the joiningRequests array with the joiningrequestmetadata
      {
        $addFields: {
          joiningRequests: {
            $map: {
              input: "$joiningRequests",
              as: "request",
              in: {
                $mergeObjects: [
                  "$$request",
                  {
                    joiningrequestmetadata: {
                      $filter: {
                        input: "$joiningrequestmetadata",
                        as: "metadata",
                        cond: {
                          $eq: ["$$metadata.joining", "$$request._id"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          // Exclude the joiningrequestmetadata field
          joiningrequestmetadata: 0
        }
      }
    ]);

    if (!trip) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The trip could not be found." });
    }
    // const singleTrip = trip[0]

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "The trip was found successfully.", data: trip });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "There was an error while trying to find the single trip.",
        error: error.message,
      });
  }
};



// Delete Trip Api

export const deleteTrip = async (req, res) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findByIdAndDelete(id);

    if (!trip) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The trip could not be found." });
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "The trip has been deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.OK).json({
      success: false,
      message: "There was an error while deleting the trip.",
      error: error.message,
    });
  }
};


// Edit Trip Api

export const updateTrip = async (req, res) => {
  try {
    const errors = validationResult(req);
    const errMessages = errorHandler(errors);

    if (errMessages && errMessages.length) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: errMessages });
    }

    const tripId = req.params.id; 

    const trip = await Trip.findById(tripId)

    const image = req.file ? req.file.filename : trip.mainTripImage;
    
    const {
      country,
      tripDate,
      tripDuration,
      tripIncludes,
      tripPrice,
      groupType,
      tripType,
      contactName,
      contactPhone,
      contactEmail,
      destination,
      document,
    } = req.body;
  

    const updatedTripData = {
      country,
      tripDate,
      tripDuration,
      tripIncludes,
      mainTripImage: image,
      tripPrice,
      groupType,
      tripType,
      contactName,
      contactPhone,
      contactEmail,
      destination:destination,
      document,
      user: req.user._id,
    };


    const data = new FormData();
    if (destination){

      destination.forEach((item) => {
        data.append(`destination[]`, JSON.stringify(item));
      });
    }

    
    const updatedTrip = await Trip.findByIdAndUpdate(tripId, updatedTripData, { new: true });

    if(!updatedTrip){
      return res.status(StatusCodes.NOT_FOUND).json({
        success: true,
        message: "The trip could not be found.",
       
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "The trip has been updated.",
      data: updatedTrip ,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        success: false,
        message: "There was an error while updating the trip.",
        error: error.message,
      });
  }
};
