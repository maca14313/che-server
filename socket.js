let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
}; 


const getUser = (senderId,receiverId) => {

  if (users.find((user) => user.userId === receiverId)) {
    return users.find((user) => user.userId === receiverId);
  } else {

    if (users.find((user) => user.userId === senderId)) {
      const sender= users.find((user) => user.userId === senderId)
      io.to(sender.socketId).emit("getMessage1", {
        senderId,
        text:'user not online'
      })
    }else{
      //console.log('sender not online')
    }

    return 0
  }
}; 

app.get('/reconnect',async(req,res)=>{
    ////console.log('connected')
    res.json('connected')
})

io.on("connection", (socket) => {




  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });










  //when ceonnect
  //console.log("a user connected.",socket.id);


  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });
  

  //send and get message
  /*
  socket.on("sendMessage1", ({ senderId, receiverId, text }) => {
      const user = getUser(senderId,receiverId);

      io.to(user.socketId).emit("getMessage1", {
        senderId,
        text,
      })

  });  */

  app.post('/sendMessage',async(req,res)=>{
    
    const getUser = (senderId,receiverId,text) => {

      if (users.find((user) => user.userId === receiverId)) {
        const receiver= users.find((user) => user.userId === receiverId)
    
        io.to(receiver.socketId).emit("getMessage1", {
          senderId,
          text,
        })
    
        ////console.log(receiver)
    
        return users.find((user) => user.userId === receiverId);
      } else {
        
        ////console.log(senderId)
            if (users.find((user) => user.userId === senderId)) {
              const sender= users.find((user) => user.userId === senderId)
              io.to(sender.socketId).emit("getMessage1", {
                senderId,
                text:'user not online'
              })
            }else{
              //console.log('sender not online')
            }
        
        
        
        return 0
      }
    }; 

    getUser(req.body.senderId,req.body.receiverId,req.body.text)

    res.json("ok")

  })

  socket.on("unacceptanceMessage", ({ senderId, receiverId, text }) => {
    ////console.log('text')
       const user = getUser(senderId,receiverId);
 
       io.to(user.socketId).emit("unacceptanceMessage", {
         senderId,
         text,
       })
     });


     socket.on("acceptedMessage", ({ senderId, receiverId, text,driverName,driverFatherName,driverGrandFatherName,driverCarType,driverCarPlate,driverPhoneNumber,driverPhoneNumber2 }) => {
      ////console.log('text')
         const user = getUser(senderId,receiverId);
   
         io.to(user.socketId).emit("acceptedMessage", {
           senderId,
           receiverId,
           driverName,
           driverFatherName,
           driverGrandFatherName,
           driverCarType,
           driverCarPlate,
           driverPhoneNumber,
           driverPhoneNumber2,
           text,
         })
       });

  //when disconnect
   socket.on("disconnect", () => {
    //console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });  
});
     