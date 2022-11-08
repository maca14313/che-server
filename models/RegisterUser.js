const mongoose=require("mongoose")
const RegisterUserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    isAdmin:{
        type:String,
        default:false,
    },
    img:{
        type:String,
    },
},{ timestamps: true })

module.exports =mongoose.model("User",RegisterUserSchema)