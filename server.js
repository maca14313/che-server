const express=require("express");

const app=require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
     origin:true,
     
  },
});
const mongoose=require('mongoose');
const mysql=require('mysql')
const cors=require('cors');
const bcrypt=require('bcryptjs')
const dotenv = require('dotenv').config();

const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")

const path = require("path");
const multer = require('multer');

const DriverData=require("./models/DriverData")


//const app=express()
app.use(cors());
app.use(cookieParser())

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '0925090339';
 /* const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"password",
  database:"test",
}) */


const db=mysql.createConnection({
  host:"sql7.freemysqlhosting.net",
  user:"sql7552364",
  password:"Rq9QBvv7dG",
  database:"sql7552364",
  PortNumber: "3306",
  connectionLimit: 50,
    queueLimit: 0,
    waitForConnection: true
})

var del = db._protocol._delegateError;
db._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};



const mongoURI = "mongodb://localhost/driverData";

const conn=mongoose.connect(mongoURI);
mongoose.connection.once('open',function(){
    console.log('ok connection');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "public/images")));



 io.on("connection",(socket)=>{
  console.log('user connected')
 })

            //firsteRegister 
             
app.post('/registerdriver',async(req,res)=>{

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const q="INSERT INTO DriverData (`name`,`fatherName`,`grandFatherName`,`gender`,`phoneNumber`,`phoneNumber2`,`city`,`address`,`kebale`,`carType`,`carPlate`,`password`,`registretionDate`,`driverId`) VALUES (?)"
  const values= [req.body.name,req.body.fatherName,req.body.grandFatherName,req.body.gender,req.body.phoneNumber,req.body.phoneNumber2,req.body.city,req.body.address,req.body.kebale,req.body.carType,req.body.carPlate,hashedPassword,req.body.registretionDate,req.body.driverId];
  
  db.query(`SELECT * FROM DriverData WHERE driverId=${req.body.driverId}`,(err,result)=>{
       const existId=result?.map((re)=>{
        return re.driverId
   })
    if(existId!=req.body.driverId){
      db.query(q,[values],(err,data)=>{
        if(err) console.log(err);
         res.json(data)
        

     
      })
    }else{
     res.json('match')
    }
  })



})     




app.get('/getdriver/:driverId',(req,res)=>{
  db.query(`SELECT * FROM DriverData WHERE driverId=${req.params.driverId}`,(err,result)=>{
    res.json(result)

  })
})



   //driver login
   app.post('/logindriver',async(req,res)=>{

    db.query(`SELECT * FROM DriverData WHERE driverId=${req.body.driverId}`,(err,data)=>{
 
 
      const findDriver=data.map((info)=>{
 
       if(info && (bcrypt.compare(req.body.password,info.password))){
         res.json({
           name:info.name,
           _id:info._id,
         })
       }else{
         res.json({
           match:'welcom',
           tryAgen:'try another',
   
          })
       }
 
 
 
      })
    })
 
    
 
 })
 

 //senddriverlocation

app.post('/senddriverlocation/:_id',async(req,res)=>{

  const findDriverAndUpdate= await db.query(`UPDATE DriverData SET latitude=${req.body.latitude?req.body.latitude:0},longitude=${req.body.longitude?req.body.longitude:0} 
  WHERE _id=${req.params._id} `,(err,data)=>{
    if(err){
      res.send(err)
    }else{
      db.query(`SELECT * FROM DriverData WHERE _id=${req.params._id}`,(err,results)=>{
         if(err){
          res.send(err)
         }else{
          results.map((result)=>{
            res.json(result)
          })
         }

      })
    }
  })

  
  
})     


///sendpassenger'slocation



app.post('/sendpassengerlocation/:zero',async(req,res)=>{

  db.query(`SELECT * FROM DriverData WHERE latitude!=${req.params.zero}`,(err,data)=>{

    if (err) {
      res.send(err)
    } else {


// Callback function for asynchronous call to HTML5 geolocation
NearestCity(req.body.latitude, req.body.longitude);


// Convert Degress to Radians
function Deg2Rad(deg) {
return deg * Math.PI / 180;
}

function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
lat1 = Deg2Rad(lat1);
lat2 = Deg2Rad(lat2);
lon1 = Deg2Rad(lon1);
lon2 = Deg2Rad(lon2);
var R = 6371; // km
var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
var y = (lat2 - lat1);
var d = Math.sqrt(x * x + y * y) * R;
return d;
}

var lat = 20; // user's latitude
var lon = 40; // user's longitude

var cities = [
["city1", 10, 50, "blah"],
["city2", 40, 60, "blah"],
["city3", 25, 10, "blah"],
["city4", 5, 80, "blah"]
];

function NearestCity(latitude, longitude) {
var minDif = 99999;
var closest;

for (index = 0; index < data.length; ++index) {
var dif = PythagorasEquirectangular(latitude, longitude, data[index].latitude, data[index].longitude);

if (dif < minDif) {
  closest = index;
  minDif = dif;
}

}

// echo the nearest city
console.log(data[closest])
}


      
    }
    
  })

})




/*
app.post('/registerdriver',async(req,res)=>{
    const {name,fatherName,grandFatherName,gender,phoneNumber,phoneNumber2,city,address,kebale,carType,carPlate,driverId,password,registretionDate}=req.body;

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const matchDriver=await DriverData.findOne({driverId:driverId})


  if (matchDriver) {
       res.json({
        match:'youser exist',
        tryAgen:'try another',

       })
  } else {
       try {
    const registerDriver= await DriverData.create({
        name,
        fatherName,
        grandFatherName,
        gender,
        phoneNumber,
        phoneNumber2,
        city,
        address,
        kebale,
        carType,
        carPlate,
        driverId,
        password:hashedPassword,
        registretionDate,
    })
    res.json(registerDriver)


   
   } catch (error) {
   res.json(error)
} 
  }

}) */

                       

  /* app.post('/logindriver',async(req,res)=>{
       
    try {
        const findDriver=await DriverData.findOne({driverId:req.body.driverId})
        if(findDriver && (await bcrypt.compare(req.body.password, findDriver.password))){
            res.json({
            name:findDriver.name,
            _id:findDriver._id,    
            token:generateToken(findDriver._id),
            })
        }else{
            res.json({
                match:'welcom',
                tryAgen:'try another',
        
               })

        }
    } catch (error) {
        res.json(error)
    }
})  */
                                 

/*
app.post('/senddriverlocation2/:_id',async(req,res)=>{
    try {
        const findDriverAndUpdate=await DriverData.findOneAndUpdate(
            {_id:req.params._id},
            {$set:{
                latitude:req.body.latitude,
                longitude:req.body.longitude
            } }
            )

            res.json(findDriverAndUpdate)
      
      } catch (error) {
        res.json(error)

    }
  })  */


 


    

 /*   

app.post('/sendpassengerlocation2/:zero',async(req,res)=>{
    const data=await DriverData.find({latitude:{$ne:req.params.zero}})


// Callback function for asynchronous call to HTML5 geolocation
    NearestCity(req.body.latitude, req.body.longitude);
  
  
  // Convert Degress to Radians
  function Deg2Rad(deg) {
    return deg * Math.PI / 180;
  }
  
  function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    lat1 = Deg2Rad(lat1);
    lat2 = Deg2Rad(lat2);
    lon1 = Deg2Rad(lon1);
    lon2 = Deg2Rad(lon2);
    var R = 6371; // km
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);
    var d = Math.sqrt(x * x + y * y) * R;
    return d;
  }
  
  var lat = 20; // user's latitude
  var lon = 40; // user's longitude
  
  var cities = [
    ["city1", 10, 50, "blah"],
    ["city2", 40, 60, "blah"],
    ["city3", 25, 10, "blah"],
    ["city4", 5, 80, "blah"]
  ];
  
  function NearestCity(latitude, longitude) {
    var minDif = 99999;
    var closest;
  
    for (index = 0; index < data.length; ++index) {
      var dif = PythagorasEquirectangular(latitude, longitude, data[index].latitude, data[index].longitude);
      
      if (dif < minDif) {
        closest = index;
        minDif = dif;
      }
      
    }
  
    // echo the nearest city
    console.log(data[closest])
  }










    

})

*/













const generateToken = (id) => {
  return jwt.sign({ id },'aaaaaaa')
}

httpServer.listen("8000",()=>{
    console.log('server on http://localhost:8000')
})