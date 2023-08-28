import mongoose from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'


const tripSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  tripDate: {
    type: Date,
    required: true,
  },
  tripDuration: {
    type: String,
    enum :["One week","Two weeks","Month","More than a month"],
    required:true
  },
  tripIncludes: {
    type: String,
    required: true,
  },
  mainTripImage: {
    type: String,
    required: true,
  },
  tripPrice: {
    type: Number,
    required: true,
  },
  groupType: {
    type: String,
    enum: ["Male", "Female", "Families"],
    required:true
  },
  tripType: {
    type: String,   
    enum: ["Adventure", "Hunt", "Historical", "Nature"],
    required:true
  },
  tripName:{
    type:String,
    required:true
  },
  contactName: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: Number,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
  },

  destination: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Destination",
    },
  ],
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
},{  
  timestamps:true
});


tripSchema.plugin(aggregatePaginate)
const Trip = new mongoose.model("Trip", tripSchema);

export default Trip;
