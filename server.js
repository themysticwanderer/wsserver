const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:"*"
 });

io.on("connection", (socket) => {
  console.log("new client connected: ", socket.id)

  /* join room for same dapp origin */
  socket.on("join room", (dappOrigin) => {
    socket.join(dappOrigin)
    console.log("provider joined room: ",dappOrigin)
  })

  /* leave room */
  socket.on("leave room", (roomID) => {
    socket.leave(roomID)
    console.log("provider left room: ", roomID)
  })

  /* send message to single room */
  socket.on("send message", (message, roomID) => {
    socket.to(roomID).emit("message", message)
  })

  /* broadcast message to multiple rooms*/
  socket.on("broadcast message", (message, roomIDs)=>{
    roomIDs.forEach(roomID => {
        socket.to(roomID).emit("message", message)
    });
  })

});

httpServer.listen(8100);