import mongoose from "mongoose";

const joiningRequestMetaDataSchema = new mongoose.Schema(
  {
    joining: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JoiningRequest",
    },
    key: {
        type:String,
      },
    value: {
        type: String,
      }
  },
  {
    timestamps: true,
  }
);

const   JoiningRequestMetaData=new mongoose.model(
  "JoiningRequestMetaData",
  joiningRequestMetaDataSchema
);

export default   JoiningRequestMetaData;

