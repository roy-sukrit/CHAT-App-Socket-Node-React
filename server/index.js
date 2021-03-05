const express = require('express');
const socketio = require('socket.io');
const http = require ('http');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');
const cors = require ('cors')
const PORT = process.env.PORT || 8000;

const router = require('./router');
const app = express();
app.use(cors());

//^initialize socket
const server = http.createServer(app);
const io = socketio(server);

//socket method

io.on("connection", (socket) => {
//console.log("USER IN ");
//join event React

//^<-------------------JOIN-------------------------------------->
     socket.on('join',({name, room}, cb )=>{
//console.log("NAME",name,"ROOM",room)
const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return cb(error)

    socket.join(user.room);


//^<-------------------1st Msg----------------------------------->
    //first message
    socket.emit('message',
    { 
      user:'admin',    
      text:`Hello ${user.name}! ,welcome to the room ${user.room}`
    })
//^<----------------------------Broadcast message -------------------------->
     //everybody else apart from user to know the message

     socket.broadcast.to(user.room).emit('message',
     {user:'admin',
     text:`${user.name} has joined`})
    //   socket.join(user.room)
   //cb()
   io.to(user.room).emit('roomData',
    {room :user.room, users:getUsersInRoom(user.room)})
     cb()
    })
//^<-----------------------React message event ---------------->
    //expecting event , emit on frontend


    socket.on('sendMessage',(message,cb) => {
     const user = getUser(socket.id);
     io.to(user.room).emit('message', {user:user.name,
    text: message})
    io.to(user.room).emit('roomData', {room:user.room,
        users: getUsersInRoom(user.room)})
    cb()
    })


     socket.on  ("disconnect", () => {
          console.log("USER LEFT");
          const user= removeUser(socket.id)
          if(user) {
              io.to(user.room).emit('message',{
                  user:'admin',
                  text: `${user.name} has left`
              })
          }
     });
});

app.use(router)

server.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})