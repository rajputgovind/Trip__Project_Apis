import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Database connected successfully....`)
    } catch (error) {
        console.log(`Error while connecting to db :`, error)
    }
}

connectDb()
export default connectDb;