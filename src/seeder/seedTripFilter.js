import 'dotenv/config'
import connectDb from '../db/connectDb.js'
import TripFilter from '../models/TripFilterModel.js'

const existingTripFilter = await TripFilter.find()

if(!existingTripFilter.length){
    const tripFilter = {
        price:true,
        duration:true,
        groupType:true,
        tripType:true
    }
    await TripFilter.insertMany(tripFilter)
}else{
    console.log("Trip filter already exist")


}

console.log("seedTripFilter is running")