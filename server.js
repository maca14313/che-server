const express=require("express");

const app=require("express")();
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
     origin:true,
     methods: ["GET", "POST"],
     wsEngine: 'ws'

     
  },
});
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

//ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '0925090339';
/* const db=mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"0925090339",
  database:"chedb",
  charset : 'utf8mb4',
}) */
const db=mysql.createConnection({
  host:"sql11.freemysqlhosting.net",
  user:"sql11649180",
  password:"g5PMzAuncH",
  database:"sql11649180",
  charset : 'utf8mb4',
}) 

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

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.get('/',(req,res)=>{
  res.send('hello')
})

let intervalID;

intervalID = setInterval(async() => {

                 db.query(`SELECT * FROM DriverData WHERE latitude!='0'`,(err,results)=>{
         if(err){
          res.send(err)
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
 
}, 5000);  
 

    
          

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
    })
 
    
 
 })
 

 //senddriverlocation

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
               console.log(data)
              res.json('accept')
             } 
   
          }
          ) 

         } else {
          res.json('canceld')
         }
     


     })
   
  })


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

for (index = 0; index < data.length; ++index) {
var dif = PythagorasEquirectangular(latitude, longitude, data[index].latitude, data[index].longitude);

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
                  clientPhoneNumber:req.body.clientPhoneNumber
                 })
                 console.log({
                  name:req.body.clientName,
                  phonesOF:req.body.clientPhoneNumber
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
                    clientPhoneNumber:req.body.clientPhoneNumber
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

