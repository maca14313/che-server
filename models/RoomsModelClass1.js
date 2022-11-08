const mongoose=require ('mongoose')

const roomSchema=mongoose.Schema({

      name:{
         type:String,
       },
       fatherName:{
        type:String,
      },
     
      studentId:{
         type:String,
      },
      year:{
        type:Number,
      },
      grade: {
        type:Number,
      },
      photos: {
        type: [String],
      },
      age: {
        type:Number,
      },
      phoneNumber: {
        type:String,
      },
      semester: {
        type:Number,
      },
    

      avrAll: {
        type: String,
        default:'0',
      },
      avr1: {
        type: String,
        default:'0',
      },
      avr2: {
        type: String,
        default:'0',
      },
      rank: {
        type: String,
        default:'0',

      },
      rank1: {
        type: String,
        default:'o',

      },
      rank2: {
        type: String,
        default:'o',

      },
      
     
      
      alQuran: {
        type: String,
      },
      atTawhiid: {
        type: String,
      },
      alFiqhi: {
        type: String,
      },
      atTarbiya: {
        type: String,
      },
      alLugatulArabiyya: {
        type: String,
      },

      alQuran2: {
        type: String,
      },
      atTawhiid2: {
        type: String,
      },
      alFiqhi2: {
        type: String,
      },
      atTarbiya2: {
        type: String,
      },
      alLugatulArabiyya2: {
        type: String,
      },
     
      roomNumbers: [{ number: Number, unavailableDates: {type: [Date]}}],
},{ timestamps: true })

module.exports=mongoose.model("Rooms",roomSchema)