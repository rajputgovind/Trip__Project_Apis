import mongoose from "mongoose";


const tripTypeSchema = new mongoose.Schema({
    tripType: {
        type:String,
        required: true
    }
},{
    timestamps:true
})


const TripType = new mongoose.model('TripType',tripTypeSchema)

export default TripType