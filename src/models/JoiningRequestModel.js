import mongoose from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const joiningRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },

    status:{
      type: String,
      enum: ["Accepted", "Rejected","New request"],
      default:"New request",
      required:true
    },
    uploadImage:{
      type:String,
      default:''
    }
  },
  {
    timestamps: true,
  }
);




joiningRequestSchema.plugin(aggregatePaginate)

const JoiningRequest = new mongoose.model(
  "JoiningRequest",
  joiningRequestSchema
);

export default JoiningRequest;



