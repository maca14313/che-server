const express=require("express");

const app=require("express")();
const httpServer = require("http").createServer(app);

const mysql=require('mysql')
const cors=require('cors');
const bcrypt=require('bcryptjs')
const dotenv = require('dotenv').config();

//const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")

const path = require("path");
const multer = require('multer');



//const app=express()
app.use(cors());
app.use(cookieParser())

const db=mysql.createConnection({
  host:"sql7.freemysqlhosting.net",
  user:"sql7709577",
  password:"UrkuDiL2Zv",
  database:"sql7709577",
  charset : 'utf8mb4',
}) 

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '0925090339';


/*
const db=mysql.createConnection({
  host:"sql7.freemysqlhosting.net",
  user:"sql7552364",
  password:"Rq9QBvv7dG",
  database:"sql7552364",
  PortNumber: "3306",
  connectionLimit: 50,
    queueLimit: 0,
    waitForConnection: true
}) */

var del = db._protocol._delegateError;
db._protocol._delegateError = function(err, sequence){
  if (err.fatal) {
    ////console.trace('fatal error: ' + err.message);
  }
  return del.call(this, err, sequence);
};






app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use("/images", express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
  res.send('hello from che server 2')
})


/*
function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
    // Convert latitude and longitude from degrees to radians
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;

    // Earth radius in meters
    var R = 6371000;

    // Calculate differences in longitude and latitude
    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
    var y = (lat2 - lat1);

    // Calculate distance using Pythagorean theorem on equirectangular approximation
    var d = Math.sqrt(x * x + y * y) * R;

    // Return the calculated distance in meters
    return d;
}

function greatCircleDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function vincentyDistance(lat1, lon1, lat2, lon2) {
  const a = 6378137; // semi-major axis of the ellipsoid in meters
  const f = 1 / 298.257223563; // flattening

  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const lambda1 = lon1 * Math.PI / 180;
  const lambda2 = lon2 * Math.PI / 180;

  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));

  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let lambda = lambda2 - lambda1;
  let lambdaP = 2 * Math.PI;

  let sinLambda, cosLambda, sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM;

  while (Math.abs(lambda - lambdaP) > 1e-12) {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2);
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha ** 2;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;

      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      const lambdaPrev = lambda;
      lambda = (lambda2 - lambda1) + (1 - C) * f * sinAlpha *
          (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));

      if (Math.abs(lambda - lambdaPrev) > 1e-12) {
          lambdaP = lambdaPrev;
      }
  }

  const uSq = cosSqAlpha * (a ** 2 - (a - f * a) ** 2) / ((a - f * a) ** 2);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 *
      (cosSigma * (-1 + 2 * cos2SigmaM ** 2) - B / 6 * cos2SigmaM *
          (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));

  const s = (a - f * a) * A * (sigma - deltaSigma);

  return s;
}

function vincentyDistance(lat1, lon1, lat2, lon2) {
  const a = 6378137; // semi-major axis of the ellipsoid in meters
  const f = 1 / 298.257223563; // flattening

  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const lambda1 = lon1 * Math.PI / 180;
  const lambda2 = lon2 * Math.PI / 180;

  const U1 = Math.atan((1 - f) * Math.tan(phi1));
  const U2 = Math.atan((1 - f) * Math.tan(phi2));

  const sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
  const sinU2 = Math.sin(U2), cosU2 = Math.cos(U2);

  let lambda = lambda2 - lambda1;
  let lambdaP = 2 * Math.PI;

  let sinLambda, cosLambda, sinSigma, cosSigma, sigma, sinAlpha, cosSqAlpha, cos2SigmaM;

  while (Math.abs(lambda - lambdaP) > 1e-12) {
      sinLambda = Math.sin(lambda);
      cosLambda = Math.cos(lambda);
      sinSigma = Math.sqrt((cosU2 * sinLambda) ** 2 + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) ** 2);
      cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
      sigma = Math.atan2(sinSigma, cosSigma);
      sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
      cosSqAlpha = 1 - sinAlpha ** 2;
      cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;

      const C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      const lambdaPrev = lambda;
      lambda = (lambda2 - lambda1) + (1 - C) * f * sinAlpha *
          (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM ** 2)));

      if (Math.abs(lambda - lambdaPrev) < 1e-12) {
          break;
      }
  }

  const uSq = cosSqAlpha * (a ** 2 - (a - f * a) ** 2) / ((a - f * a) ** 2);
  const A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
  const B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
  const deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 *
      (cosSigma * (-1 + 2 * cos2SigmaM ** 2) - B / 6 * cos2SigmaM *
          (-3 + 4 * sinSigma ** 2) * (-3 + 4 * cos2SigmaM ** 2)));

  const s = (a - f * a) * A * (sigma - deltaSigma);

  return s;
}


function karneyDistance(lat1, lon1, lat2, lon2) {
  const a = 6378137; // semi-major axis of the ellipsoid in meters
  const f = 1 / 298.257223563; // flattening

  const phi1 = lat1 * (Math.PI / 180);
  const phi2 = lat2 * (Math.PI / 180);
  const lambda1 = lon1 * (Math.PI / 180);
  const lambda2 = lon2 * (Math.PI / 180);

  const sinPhi1 = Math.sin(phi1);
  const cosPhi1 = Math.cos(phi1);
  const sinPhi2 = Math.sin(phi2);
  const cosPhi2 = Math.cos(phi2);

  const deltaLambda = lambda2 - lambda1;
  const cosDeltaLambda = Math.cos(deltaLambda);
  const sinDeltaLambda = Math.sin(deltaLambda);

  const numerator1 = cosPhi2 * sinDeltaLambda;
  const numerator2 = cosPhi1 * sinPhi2 - sinPhi1 * cosPhi2 * cosDeltaLambda;
  const numerator = Math.sqrt(numerator1 ** 2 + numerator2 ** 2);

  const denominator1 = sinPhi1 * sinPhi2 + cosPhi1 * cosPhi2 * cosDeltaLambda;
  const denominator2 = 1 + cosPhi1 * cosPhi2 * sinDeltaLambda;
  const denominator = denominator1 / denominator2;

  const sigma = Math.atan2(numerator, denominator);

  const sinSigma = Math.sin(sigma);
  const cosSigma = Math.cos(sigma);

  const uSq = cosPhi1 * cosPhi2 * sinDeltaLambda;
  const aSq = cosPhi1 * cosPhi2 * sinDeltaLambda;
  const bSq = cosPhi1 * cosPhi2 * sinDeltaLambda;
  const deltaSigma =
      f / 16 * cosPhi1 * cosPhi2 * sinDeltaLambda *
      (4 + f * (4 - 3 * cosPhi1 * cosPhi2 * sinDeltaLambda));

  const s = a * (sigma - deltaSigma);

  return s;
}


var distance = PythagorasEquirectangular(7.671068528629427, 36.837259055213664,7.671985183807098,36.83746289408595);
var distance2 = greatCircleDistance(7.671068528629427, 36.837259055213664,7.671985183807098,36.83746289408595);
var distance3 = haversineDistance(7.671068528629427, 36.837259055213664,7.671985183807098,36.83746289408595);
var distance4 = vincentyDistance(7.671068528629427, 36.837259055213664,7.671985183807098,36.83746289408595);
var distance5 = karneyDistance(7.671068528629427, 36.837259055213664,7.671985183807098,36.83746289408595);




console.log(distance,'distance1') 
console.log(distance2,'distance2') 
console.log(distance3,'distance3') 
console.log(distance4,'distance4') 
console.log(distance5,'distance5') */






























//////exported   
/*
let intervalID;

intervalID = setInterval(async() => {
                 db.query(`SELECT * FROM DriverData WHERE latitude!='0'`,(err,results)=>{
         if(err){
          //res.send(err)
          console.log(err)
         }else{
          //console.log(results)
          results.map((result)=>{
            var t1 = new Date();
            var t2 = result.locUpdate;
             var dif = (t1 - t2)/1000;
           console.log('reset',result.locUpdate,dif)
           db.query(`UPDATE DriverData SET locDif=${dif}
                     WHERE id=${result.id} `,(err,data)=>{
                     if (err) {
                      console.log(err)
                     } else {

                      db.query(`UPDATE DriverData SET latitude=0,longitude=0,clientName='0',clientLat='0',
                                clientLon='0',clientPhone='0',checkClient='0'
                     WHERE locDif>40 OR locDif<0  `,(err,data)=>{
                         
                     })
                       
                      console.log('dif is',dif,'locDif',result.locDif,'latitude',result.latitude,'id',result.id)
                     }

  })


          })
        
         }

      })
 
}, 5000);  */
 
app.post('/isdriveronline',async(req,res)=>{
try {
  console.log('isdriveronline')
  db.query(`SELECT * FROM DriverData WHERE latitude!='0'`,(err,results)=>{
    if(err){
     //res.send(err)
     console.log(err)
    }else{
     console.log(results,'isdriveronline')
     results.map((result)=>{
       var t1 = new Date();
       var t2 = result.locUpdate;
        var dif = (t1 - t2)/1000;
      console.log('reset',result.locUpdate,dif)
      db.query(`UPDATE DriverData SET locDif=${dif}
                WHERE id=${result.id} `,(err,data)=>{
                if (err) {
                 console.log(err)
                } else {

                 db.query(`UPDATE DriverData SET latitude=0,longitude=0,clientName='0',clientLat='0',
                           clientLon='0',clientPhone='0',checkClient='0'
                WHERE locDif>40 OR locDif<0  `,(err,data)=>{
                  if(data){

                    res.json('ok')
                   }
                })
                  
                 console.log('dif is',dif,'locDif',result.locDif,'latitude',result.latitude,'id',result.id)
                }

})


     })
   
    }

 })
} catch (error) {
  console.log(error)
}
})
    
          

            //firsteRegister 
//////exported   
         
app.post('/registerdriver',async(req,res)=>{

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  const q="INSERT INTO DriverData (`name`,`fatherName`,`grandFatherName`,`gender`,`phoneNumber`,`phoneNumber2`,`city`,`address`,`kebale`,`carType`,`carPlate`,`password`,`registretionDate`,`driverId`) VALUES (?)"
  const values= [req.body.name,req.body.fatherName,req.body.grandFatherName,req.body.gender,req.body.phoneNumber,req.body.phoneNumber2,req.body.city,req.body.address,req.body.kebale,req.body.carType,req.body.carPlate,hashedPassword,req.body.registretionDate,req.body.driverId];
  
  db.query(`SELECT * FROM DriverData WHERE driverId=${req.body.driverId}`,(err,result)=>{
       const existId=result?.map((re)=>{
        return re.driverId
   })
     const driverPhone=result?.map((re)=>re.phoneNumber)
   if (result.length==0) {
    db.query(`SELECT * FROM DriverData WHERE phoneNumber=${req.body.phoneNumber}`,(err,resu)=>{
      if (resu.length==0) {
        db.query(q,[values],(err,data)=>{
          if(data) 
           res.json('registerd')
           console.log('ok')
          
  
       
        })
      }else{
        res.json('matched number')
        console.log('match number')
      }
    })
   // console.log('errrrrr')
   }else{
    res.json('matched id')
    console.log('match id')
   }
    /*if(existId!=req.body.driverId && driverPhone!=req.body.phoneNumber){
      db.query(q,[values],(err,data)=>{
        if(err) 
         res.json(data)
         console.log(err)
        

     
      })
    }else{
     res.json('match')
     console.log('err')

    } */
   
  })



})     


app.get('/getdrivers',(req,res)=>{
  db.query(`SELECT * FROM DriverData`,(err,result)=>{
    try {
      console.log(result,'all drivers')
      res.json(result)

    } catch (error) {
      console.log(error)
    }

  })
})

////// exported
app.get(`/searchbyname/:searchText`,(req,res)=>{
  db.query(`SELECT * FROM DriverData WHERE name LIKE '${req.params.searchText}%' OR phoneNumber LIKE '${req.params.searchText}%'`,(err,result)=>{
    if (result) {
      console.log(result)
      res.json(result)
    }else{
      res.json(err)
      console.log(err)
                }
  })
})

app.get('/getdriver/:driverId',(req,res)=>{
  db.query(`SELECT * FROM DriverData WHERE driverId=${req.params.driverId}`,(err,result)=>{
    res.json(result)

  })
})



   //driver login

   ////// exported
   
   app.post('/logindriver',async(req,res)=>{

    db.query(`SELECT * FROM DriverData WHERE driverId=${req.body.driverId}`,(err,data)=>{
 
 
      try {
        const findDriver=data.map((info)=>{
 
          if(info && (bcrypt.compare(req.body.password,info.password))){
            res.json({
              name:info.name,
              id:info.id,
              fatherName:info.fatherName,
              grandFatherName:info.grandFatherName,
              phoneNumber:info.phoneNumber,
              phoneNumber2:info.phoneNumber2,
              carType:info.carType,
              carPlate:info.carPlate,
     
            })
          }else{
            res.json({
              match:'welcom',
              tryAgen:'try another',
      
             })
          }
    
    
    
         })
      } catch (error) {
        console.log(error)
      }
    })
 
    
 
 })
 

 //senddriverlocation
/// exported 
app.post('/senddriverlocation/:id',async(req,res)=>{//,locUpdate=${Date.now()}

  const findDriverAndUpdate= await db.query(`UPDATE DriverData SET latitude=${req.body.latitude?req.body.latitude:0},longitude=${req.body.longitude?req.body.longitude:0},locUpdate=${Date.now()} 
  WHERE id=${req.params.id} `,(err,data)=>{
    if(err){
      //console.log(new Date())
      res.send(err)
    }else{
      db.query(`SELECT * FROM DriverData WHERE id=${req.params.id}`,(err,results)=>{
         if(err){

          res.send(err)
         }else{
          results.map((result)=>{
            //console.log('reset',result)
            res.json(result)
          })
         }

      })
    }
  })

  
  
})  



app.post('/senddriverTrackinglocation/:id',async(req,res)=>{

  const q="INSERT INTO Tracking_info (`driver_id`,`latitudeTracking`,`longitudeTracking`) VALUES (?)"
  const values= [req.params.id,req.body.latitude,req.body.longitude];
  
      try {
        db.query(q,[values],(err,data)=>{
          if(data){ 
           res.json('registerd')
           console.log('ok')
          }else{
            res.json(err)
            console.log(err)
            
          }
          
        })
      } catch (error) {
        res.json(error)
        console.log(error,'senddriverTrackinglocation')
      }
}) 


//// exeported
app.get('/checkClient/:id',async(req,res)=>{
     try {
      db.query(`SELECT * FROM DriverData WHERE id=${req.params.id}`,(err,findClient)=>{
 
        if(err){
          res.send(err)
         }else{
          const check=findClient.map((d)=>{
               return d.checkClient
          })
          console.log(check)
          //res.json(check)

          if (findClient.map(d=>d.checkClient)==1) {
            console.log('driverNameee',findClient.map(d=>d.clientName))
            //let checkClients =findClient.map(d=>d.checkClient),let names=findClient.map(d=>d.clientName),
             res.json({

              checkClient:findClient.map(d=>d.checkClient),
              clientName:findClient.map(d=>d.clientName),
              clientPhone:findClient.map(d=>d.clientPhone),
              clientLat:findClient.map(d=>d.clientLat),
              clientLon:findClient.map(d=>d.clientLon),
              clientFrom:findClient.map(d=>d.fromWhere),
              clientGoTo:findClient.map(d=>d.goTo),
              clientPrice:findClient.map(d=>d.price),


             

             })
          } else {
            console.log('not found',findClient.map(d=>d.checkClient))

            res.json({
              checkClient:findClient.map(d=>d.checkClient),
             
            })
          }
    
          
         }
       
      })
     } catch (error) {
      
     }


})




///// exported
app.get('/senddatatoclientfromdriver/:id',async(req,res)=>{


  db.query(`SELECT * FROM DriverData WHERE id=${req.params.id}`,(err,data)=>{
 
    if(err){
      res.send(err)
     }else
         if (data.map(d=>d.searching)==1) {
          db.query(`UPDATE ClientData SET driverName='${data.map(d=>d.name)}',driverFatherName='${data.map(d=>d.fatherName)}',
          driverPhoneNumber1='${data.map(d=>d.phoneNumber)}',driverPhoneNumber2='${data.map(d=>d.phoneNumber2)}',
          driverCarPlate=${data.map(d=>d.carPlate)},driverCarType='${data.map(d=>d.carType)}',driverAcceptance=1,driverId=${data.map(d=>d.id)}
          WHERE clientPhoneNumber=${data.map(d=>d.clientPhone)} `,(err,clientData)=>{
   
            if(err){
             console.log(err)
            res.send(err)
             }else{
               console.log(data,'accept')
               //res.json('accept')
               const q="INSERT INTO Ride_data (`driver_id`,`clientName`,`clientPhone`,`fromWhere`,`goTo`,`price`,`clientLon`,`clientLat`,`finished`) VALUES (?)"
               const values= [data.map(d=>d.id),data.map(d=>d.clientName),data.map(d=>d.clientPhone),data.map(d=>d.fromWhere),data.map(d=>d.goTo),data.map(d=>d.price),data.map(d=>d.clientLon),data.map(d=>d.clientLat),'no'];
               
                   try {
                     db.query(q,[values],(er,data)=>{
                       if(data){ 
                        res.json('accept')
                        console.log('ok Ride_data')
                       }else{
                         res.json(er)
                         console.log(er)
                         
                       }
                       
                     })
                   } catch (error) {
                     res.json(error)
                     console.log(error,'senddriverTrackinglocation')
                   }
              
              //res.json('accept')
             } 
   
          }
          ) 

         } else {
          res.json('canceld')
         }
     


     })
   
  })

/// exported
  app.get('/rejectedfromdriver/:id',async(req,res)=>{


    db.query(`SELECT * FROM DriverData WHERE id=${req.params.id}`,(err,data)=>{
   
      if(err){
        res.send(err)
       }else
          if (data.map(d=>d.searching)==1) {
            db.query(`UPDATE ClientData SET driverAcceptance=2,driverId=${data.map(d=>d.id)}
         WHERE clientPhoneNumber=${data.map(d=>d.clientPhone)} `,(err,clientData)=>{
  
           if(err){
            console.log(err)
           res.send(err)
            }else{
              console.log('rejected')
             res.json('rejected')
            } 
  
         }
         ) 
          } else {
            res.json('rejected')
          }
        
  
  
       })
     
    })


 /* app.get('/clearclientinfo/:id',async(req,res)=>{


    db.query(`SELECT * FROM DriverData WHERE id=${req.params.id}`,(err,data)=>{
   
      if(err){
        res.send(err)
       }else
  
        db.query(`UPDATE ClientData SET driverName='${data.map(d=>d.name)}',driverFatherName='${data.map(d=>d.fatherName)}',
         driverPhoneNumber1=${data.map(d=>d.phoneNumber)},driverPhoneNumber2=${data.map(d=>d.phoneNumber2)},
         driverCarPlate=${data.map(d=>d.carPlate)},driverCarType='${data.map(d=>d.carType)}',driverAcceptance=1,driverId=${data.map(d=>d.id)}
         WHERE clientPhoneNumber=${data.map(d=>d.clientPhone)} `,(err,clientData)=>{
  
           if(err){
            console.log(err)
           res.send(err)
            }else{
              console.log(data)
             res.json(clientData)
            } 
  
         }
         ) 
  
  
       })
     
    }) */

//// exported
    app.post('/clearclientinfo/:id',(req,res)=>{
      db.query(`UPDATE DriverData SET clientName='0',clientLat='0',
      clientLon='0',clientPhone='0',checkClient='0',latitude='0',longitude='0',finished=finished+1
      
      WHERE id=${req.params.id} `,(err,DriverData)=>{

        if(err){
         console.log(err)
        res.send(err)
         }else{
           console.log('cleared')
          res.json('cleared')
         } 

      }
      ) 

     })

/// exported 
     app.post('/rejectedclientinfo/:id',(req,res)=>{
      db.query(`UPDATE DriverData SET clientName='0',clientLat='0',
      clientLon='0',clientPhone='0',checkClient='0',latitude='0',longitude='0'
      
      WHERE id=${req.params.id} `,(err,DriverData)=>{

        if(err){
         console.log(err)
        res.send(err)
         }else{
           console.log('rejectedclientinfocleared')
           res.json('rejected')
         } 

      }
      ) 

     })

//// exported
     app.get('/checktogether/:driverphonenumber/:clientphone',async(req,res)=>{
       try {
        db.query(`SELECT * FROM ClientData WHERE clientPhoneNumber=${req.params.clientphone}`,(err,together)=>{
           if(err){
            
            console.log(err)
           }else{
            if(together.map((to)=>to.driverPhoneNumber1)==req.params.driverphonenumber){
              res.json('yes')
              console.log('checkClientYes')
            }else{
              res.json('no')
              console.log('checkClientNo')
            }
           }
        })
       } catch (error) {
        console.log('not yet')
       }
     })


/////////// exported
     app.get('/checktogetherfromclient/:clientphonenumber/:driverphone',async(req,res)=>{
      try {
       db.query(`SELECT * FROM DriverData WHERE phoneNumber='${req.params.driverphone}'`,(err,together)=>{
          if(err){
           
           console.log(err)
          }else{
           if(together.map((to)=>to.clientPhone)==req.params.clientphonenumber){
             res.json('yes')
             console.log('checkDriverYes')
           }else{
             res.json('no')
             console.log('checkDriverNo')
           }
          }
       })
      } catch (error) {
       console.log('not yet')
      }
    })



  






///sendpassenger'slocation


//////// exported
app.post('/sendpassengerlocation/:zero/:clientPhone/:name',async(req,res)=>{
    

  
    
 console.log('sooo',req.body.from)


  db.query(`SELECT * FROM DriverData WHERE latitude!='0' AND
   id!=${req.body.driverId1} AND
    id!=${req.body.driverId2} AND
     id!=${req.body.driverId3} AND
      id!=${req.body.driverId4} AND
       id!=${req.body.driverId5} AND
        id!=${req.body.driverId6} AND
         id!=${req.body.driverId7} AND
          id!=${req.body.driverId8} AND
           id!=${req.body.driverId9} AND
            id!=${req.body.driverId10}`,(err,data)=>{

    if (err) {
      res.send(err)
    } else {


// Callback function for asynchronous call to HTML5 geolocation
NearestCity(req.body.latitude?req.body.latitude:'0',req.body.longitude?req.body.longitude:'0');


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

for (let index = 0; index < data.length; ++index) {
var dif = PythagorasEquirectangular(latitude, longitude, data[index].latitude, data[index].longitude);
console.log(dif,'qwertyuiokjhgfdsasdvbnmnbvcdsryuoiuytredd')
if (dif < minDif) {
  closest = index;
  minDif = dif;
}

}

// echo the nearest city
 var closestData=data[closest]
 ////console.log()

var someClosestData=[{
 "id":"closestData.id",
  "name":"closestData.name",
  "fatherName":"closestData.fatherName",
  "grandFatherName":"closestData.grandFatherName",
  "phoneNumber":"closestData.phoneNumber",
  "phoneNumber2":"closestData.phoneNumber2",
  "carType":"closestData.carType",
  "carPlate":"closestData.carPlate",
  
 
 
 }]
 //////console.log(someClosestData)


 
var name=req.params.name
var nameStringify=JSON.stringify(name)

//console.log(closestData?closestData.id:'0')
var id=closestData?closestData.id:'0'


db.query(`UPDATE DriverData SET checkClient=1,clientLat=${req.body.latitude?req.body.latitude:0},clientLon=${req.body.longitude?req.body.longitude:0},clientPhone='${req.params.clientPhone?req.params.clientPhone:0}',clientName=${nameStringify?nameStringify:0},fromWhere='${req.body.from?req.body.from:0}',goTo='${req.body.goTo?req.body.goTo:0}',price='${req.body.price?req.body.price:0}',searching=1
WHERE id=${id} `,(err,data)=>{
  if(err){
    console.log(err)

    //res.send(err)
  }else{
    if (id=='0') {
      res.json('noDriver')
    }else{
      console.log(nameStringify)
      //res.json('good')
      res.json({
        good:'good',
        id:closestData?closestData.id:'0',
      })
    }
   
  }
})
    
db.query(`UPDATE ClientData SET searching=1
WHERE clientPhoneNumber=${req.params.clientPhone} `,(err,data)=>{})




   


 //res.json(closestData)

 


}


      
  }
  
  

  })




})

                ////////////////////////////////////////////////////////////////
                                  ////       MESSAGES 
  /////////// exported
  app.post('/sendmessagefromdriver/:messageinput/:clientPhone',async(req,res)=>{
    console.log(req.params.messageinput)
     try {
          db.query(`UPDATE ClientData SET driverMessage='${req.params.messageinput}',driverMNo=driverMNo+1 WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,messages)=>{
                     if(err){
                         console.log(err)
                     }else{
                      res.json({
                        textMessage:req.params.messageinput,
                        messageId:'1'
                      })
                      console.log('from driver',req.params.messageinput)
                      console.log(req.params.messageinput)
                    
                     }
          })
     } catch (error) {
                    res.send('error')

     }
  })

  /////////// exported
  app.post('/sendmessagefromclient/:messageinput/:clientPhone',async(req,res)=>{
    console.log(req.params.messageinput)
      try {
        db.query(`UPDATE ClientData SET clientMessage='${req.params.messageinput}',clientMNo=clientMNo+1 WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,messages)=>{
          if(err){
              console.log(err)
          }else{
            res.json({
              textMessage:req.params.messageinput,
              messageId:'1'
            })
            console.log('from client',req.params.messageinput)
            console.log(req.params.messageinput)
  
          }
         })
      } catch (error) {
        res.send('error')
      }
  })

 /* app.post('/sendmessagefromclient/:messageinput/:clientPhone',async(req,res)=>{
    try {
      db.query(`UPDATE ClientData SET clientMessage='${req.params.messageinput}',clientMNo=clientMNo+1 WHERE clientPhoneNumber=${req.params.clientPhone}`,(err,messages)=>{
        if(err){
            console.log(err)
        }else{
          res.json(req.params.messageinput)
          console.log('from client',req.params.messageinput)

        }
       })
    } catch (error) {
      res.send(error)
    }
}) */

//// exported
  app.get('/checkmessagesfromclient/:clientPhone',async(req,res)=>{
     try {
       db.query(`SELECT * FROM ClientData WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,results)=>{
           if(err){
               console.log(err)
           }else{
            if(results.map(result=>result.clientMessage)!=''){

              res.json({
                textMessage:results.map(result=>result.clientMessage),
                messageId:'2'
              })
              console.log(results.map(result=>result.clientMessage),'client')

              
            }else{
              console.log('noMessage from client')
              res.json({
                noMessage:'noMessage'
              })
            }
           }
       })

     } catch (error) {
      res.send(error)
     }
  })

  ///////// exported
  app.get('/checkmessagesfromdriver/:clientPhone',async(req,res)=>{
    try {
      db.query(`SELECT * FROM ClientData WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,results)=>{
              if(err){
               console.log(err)
              }else{
                if(results.map(result=>result.driverMessage)!=''){
                  res.json({
                    textMessage:results.map(result=>result.driverMessage),
                    messageId:'2'
                  })
                  console.log(results.map(result=>result.driverMessage),'driver')
                 
                  
                }else{
                  console.log('noMessage from driver')
                  res.json({
                    noMessage:'noMessage'
                  })
                }
              }
      })
    } catch (error) {
      
    }
  })

  //// exported
  app.get('/clearclientmessages/:clientPhone',async(req,res)=>{
    try {

      db.query(`UPDATE ClientData SET clientMessage='' WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,response)=>{
        if(err){
            console.log(err)
        }else{
          res.json('cleard')
          console.log('cleard from driver')
        }
  })

    } catch (error) {
      
    }
  
  })

  ///////// exported
  app.get('/cleardrivermessages/:clientPhone',async(req,res)=>{
    try {

      db.query(`UPDATE ClientData SET driverMessage='' WHERE clientPhoneNumber='${req.params.clientPhone}'`,(err,response)=>{
        if(err){
            console.log(err)
        }else{
          res.json('cleard')
          console.log('cleard from client')
        }
  })

    } catch (error) {
      
    }
  
  })


           ////////////////////////////////////////////////////////////////
 

                                             ///////////////  CLIENT REG

//////// exported     

      app.post('/regclientdata',async(req,res)=>{

        try {
          db.query(`SELECT * FROM ClientData WHERE clientPhoneNumber=${req.body.clientPhoneNumber}`,(err,findClient)=>{
               
           if(findClient.length===0){

              const q="INSERT INTO ClientData (`clientName`,`clientPhoneNumber`) VALUES (?)"
              const values= [req.body.clientName,req.body.clientPhoneNumber];
      
              db.query(q,[values],(err,data)=>{
                if(err){ //console.log(err);
                  console.log(err)
                 //res.json(data)
                }else{
                 res.json({
                  clientName:req.body.clientName,
                  clientPhoneNumber:req.body.clientPhoneNumber,
                  success:'yes'
                 })
                 console.log({
                  name:req.body.clientName,
                  phonesOF:req.body.clientPhoneNumber,
                  success:'yes'
                 })
                  
                }
                
        
             
              })
              //console.log(err)
              //res.send(err)
             }else{
              db.query(`UPDATE ClientData SET clientName='${req.body.clientName}'
              WHERE clientPhoneNumber=${req.body.clientPhoneNumber} `,(err,clientData)=>{
       
                if(err){
                 console.log(err)
                res.send(err)
                 }else{
                  res.json({
                    clientName:req.body.clientName,
                    clientPhoneNumber:req.body.clientPhoneNumber,
                    success:'yes'
                   })
                   console.log('notNew',findClient.length)

                 } 
       
              }
              ) 
                
              
             }
            
            }

          )
              

         

        } catch (error) {
          res.send(error)
        }

       

       
      })                          

/////////// exported

      app.get('/checkdriveracceptance/:clientPhone',async(req,res)=>{
             
        try {
          db.query(`SELECT * FROM ClientData WHERE clientPhoneNumber=${req.params.clientPhone}`,(err,findClient)=>{
               if (err) {
                console.log(err)
               } else {

                if (findClient.map(d=>d.driverAcceptance)==1) {
                  console.log('driverName',findClient.map(d=>d.driverName))
                   res.json({

                    driverAcceptance:findClient.map(d=>d.driverAcceptance),
                    driverName:findClient.map(d=>d.driverName),
                    driverFatherName:findClient.map(d=>d.driverFatherName),
                    driverPhoneNumber1:findClient.map(d=>d.driverPhoneNumber1),
                    driverPhoneNumber2:findClient.map(d=>d.driverPhoneNumber2),
                    driverCarPlate:findClient.map(d=>d.driverCarPlate),
                    driverCarType:findClient.map(d=>d.driverCarType),

                   })
                } 
              /*  if (findClient.map(d=>d.driverAcceptance)==2) {
                  console.log('rejected 2',findClient.map(d=>d.driverAcceptance))
                   res.json({

                    driverAcceptance:findClient.map(d=>d.driverAcceptance),
                    driverId:findClient.map(d=>d.driverId),
                    

                   })
                }*/ else {
                  console.log('driver not found',findClient.map(d=>d.driverAcceptance))

                  res.json({
                    driverAcceptance:findClient.map(d=>d.driverAcceptance),
                    driverId:findClient.map(d=>d.driverId),

                  })
                }

               }

          })
        } catch (error) {
          
        }
            
         
      })
//////////// exported
       app.post('/resetride/:clientPhone',(req,res)=>{
        db.query(`UPDATE ClientData SET driverName='0',driverFatherName='0',
        driverPhoneNumber1='0',driverPhoneNumber2='0',
        driverCarPlate='0',driverCarType='0',driverAcceptance='0',driverId='0',rideCount=rideCount+1
        WHERE clientPhoneNumber=${req.params.clientPhone} `,(err,clientData)=>{
 
          if(err){
           console.log(err)
          res.send(err)
           }else{
             console.log('data')
            res.json('resetride')
           } 
 
        }
        ) 
 
       })

    //////////// exported
       app.post('/resetdriveracceptance/:clientPhone',(req,res)=>{
        db.query(`UPDATE ClientData SET driverAcceptance='0',driverId='0'
        WHERE clientPhoneNumber=${req.params.clientPhone} `,(err,clientData)=>{
 
          if(err){
           console.log(err)
          res.send(err)
           }else{
             console.log('resetDriverAcceptance')
            res.json(clientData)
           } 
 
        }
        ) 
 
       })

   ////exported
       app.post('/cancelsearch/:id',(req,res)=>{                                                                     
        db.query(`UPDATE DriverData SET checkClient=0,clientLat=0,clientLon=0,clientPhone=0,clientName=0,searching=0
        WHERE id=${req.params.id} `,(err,clientData)=>{
          if (err) {
            console.log(err)
          } else {
            console.log('okkkkkkkkkkkkkkkkkkk',clientData)
          }
       })
      }
       )

















/*const generateToken = (id) => {
  return jwt.sign({ id },'aaaaaaa')
} */
const PORT=process.env.PORT || 8000

httpServer.listen(PORT,()=>{
    //console.log('server on http://localhost:8000')
})

