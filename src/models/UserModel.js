import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

const userSchema = new mongoose.Schema({
    name:{
        type:String, required:true
    },
    email:{
        type:String, required:true
    },
    phone:{
        type:Number, required:true
    },
    birthDate:{
        type:Date, required:true
    },
    password:{
        type:String, required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    
    isOrganizer:{
        type:Boolean,
        default:false
    },
    
    role:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Role",
        required:true
    },
    profileImage:{
        type:String,
        default:''
    },
    otp: {
        value: { type: String },
        expire: { type: Date },
      },
},{
    timestamps:true
})


// Generate Token

userSchema.methods.generateAuthToken = async function(){
    try {
        // console.log("token code")
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY,{
            expiresIn:'24h'
        })    
        // this.tokens = this.tokens.concat({token:token})
        // await this.save()
        return token;
    } catch (error) {
        console.log("error in generating token", error)
    }
    
}

userSchema.plugin(aggregatePaginate)
const User = new mongoose.model('User', userSchema)

export default User