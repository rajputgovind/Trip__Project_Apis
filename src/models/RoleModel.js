import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    roleName : {
        type:String,
        required:true,
        unique: true
    }
},{
    timestamps:true
})

const Role = new mongoose.model("Role",roleSchema)

export default Role