const mongoose=require("mongoose")
const RegistretionIdSchema=mongoose.Schema({
    regId:{
        type:Number,
        default:0000,
    },
   
},{ timestamps: true })

module.exports =mongoose.model("RegistretionId",RegistretionIdSchema)