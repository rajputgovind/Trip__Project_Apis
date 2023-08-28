import { StatusCodes } from "http-status-codes";
import TripType from "../models/TripTypeModel.js";

// Create Trip Type Api

export const createTripType = async (req, res) => {
  try {
    const tripType = new TripType({ tripType: req.body.tripType });
    const tripTypeData = await tripType.save();

    if (!tripTypeData) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "The type of trip could not be found." });
    }
    return res
      .status(StatusCodes.CREATED)
      .json({
        success: true,
        message: "The trip type has been created.",
        data: tripTypeData,
      });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "There was an error while creating the type of trip." });
  }
};

// Get All Type of Trip Api

export const getAllTripTypes = async (req, res) => {
  try {
    const tripType = await TripType.find({});
    if (!tripType) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The type of trip could not be found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({
        success: true,
        message: "All types of trips have been fetched successfully.",
        data: tripType,
      });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "There was an error while fetching the types of trips." });
  }
};

// Delete Price Api

export const deleteTripType = async (req, res) => {
  try {
    const tripType = await TripType.findByIdAndDelete(req.params.id);
    if (!tripType) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: "The type of trip could not be found." });
    }
    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "The type of trip has been deleted." });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "There was an error while deleting the trip type." });
  }
};
