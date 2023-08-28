import { StatusCodes } from "http-status-codes";
import TripFilter from "../models/TripFilterModel.js";


// Trip Filter Post Api

export const createTripFilter = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const tripFilter = await TripFilter.findOne();
    
    if (!tripFilter) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Bad Request" });
    }

    updates.forEach((update) => {
      tripFilter[update] = req.body[update];
    });
    await tripFilter.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "The filter has been applied.", date: tripFilter });

  } catch (error) {
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "There was an error while applying the filter." });
  }
};

// Get All Trip Filter

export const getAllTripFilter = async (req, res) => {
  try {
    const tripFilter = await TripFilter.findOne();
    if (!tripFilter) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The trip filter could not be found." });
    }
    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Fetch all trip type successfully",
      data: tripFilter,
    });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "There was an error while fetching the trip filter." });
  }
};
