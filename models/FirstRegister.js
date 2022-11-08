const mongoose=require ('mongoose')

const firstRegisterSchema=mongoose.Schema({
      name:{
        type:String,
        required: true,
      },
      fatherName:{
        type:String,
        required: true,
      },
      motherName:{
        type:String,
        required: true,
      },
      firstLanguage:{
        type:String,
        required: true,
      },
      secondLanguage:{
        type:String,
        required: true,
      },
      id:{
        type:Number,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      kebale: {
        type: String,
        required: true,
      },
     gender: {
        type: String,
      },
      specialCase: {
        type: String,
      },
      specialSkill: {
        type: String,
      },
      quranSkill: {
        type: String,
      },
      photos: {
        type: String,
      },
      dateOfBirth: {
        type: String,
        required: true,
      },
      grade: {
        type: String,
        required: true,
      },
      classRooms: {
        type:[String]
      },
      registretionDate: {
        type:String,
      },
      year: {
        type:String,
      },
      phoneNumber: {
        type:String,
      },
      phoneNumber2: {
        type:String,
      },
      waamamaa: {
        type:String,
      },
      hood: {
        type:String,
      },
   
     
},{ timestamps: true })

module.exports=mongoose.model("FirstRegister",firstRegisterSchema)