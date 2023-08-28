import mongoose from "mongoose";


const priceSchema = new mongoose.Schema({
    price: {
        type:Number,
        required: true
    }
},{
    timestamps:true
})


const Price = new mongoose.model('Price',priceSchema)

export default Price