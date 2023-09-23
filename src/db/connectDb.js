import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        // govind.jadam@vkaps.com wala uri
        // await mongoose.connect(process.env.MONGO_URI)
        
        //govindrajput7649@gmail.com walauri
        // console.log("hello")
        await mongoose.connect(process.env.MONGODB_URI)
         
        console.log(`Database connected successfully....`)
    } catch (error) {
        console.log(`Error while connecting to db :`, error)
    }
}

connectDb()
export default connectDb;