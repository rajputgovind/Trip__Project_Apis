import mongoose from "mongoose";


const durationSchema = new mongoose.Schema({
    duration: {
        type:String,
        required: true
    }
},{
    timestamps:true
})


const Duration = new mongoose.model('Duration',durationSchema)

export default Duration