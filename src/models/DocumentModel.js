import mongoose from "mongoose";


const documentSchema = new mongoose.Schema({
    firstName : {
        type: Boolean,
        default: false
    },
    lastName :{
        type: Boolean,
        default: false
    },
    passport : {
        type: Boolean,
        default: false
    },
    age : {
        type: Boolean,
        default: false
    },
    gender : {
        type: Boolean,
        default: false
    },
    birthDate : {
        type: Boolean,
        default: false
    },
    id : {
        type: Boolean,
        default: false
    },
    healthIssues : {
        type: Boolean,
        default: false
    }
},{
    timestamps:true
})


const Document = new mongoose.model('Document',documentSchema)

export default Document

