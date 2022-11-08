const mongoose=require('mongoose');

const driverSchema=mongoose.Schema({
      name:{
        type:String,
        required: true,
      },
      fatherName:{
        type:String,
        required: true,
      },
      grandFatherName:{
        type:String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      phoneNumber: {
        type:Number,
        required: true,
      },
      phoneNumber2: {
        type:Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: Number,
        required: true,
      },
      kebale: {
        type: String,
        required: true,
      },
      carType: {
        type: String,
        required: true,
      },
      carPlate:{
        type:Number,
        required: true,
      },
      password:{
        type:String,
        required: true,
      },
      registretionDate: {
        type:String,
        required: true,
      },
      driverId:{
        type:Number,
        required:true,
        default:0,
      },
      location: {
        type:[Array],
        default:[{
          latitude:0,
          longitude:0,
        }],

      },
      latitude:{
        type:String,
        default:0,
      },
      longitude:{
        type:String,
        default:0,
      },

      
    
      
     
    
    
})


module.exports=mongoose.model("DriverData",driverSchema)
