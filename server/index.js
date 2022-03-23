const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected  : ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("Joining room : ", data, " user : ", socket.id);
    socket.join(data);
  });

  socket.on("send_message", (messageData) => {
    console.log("Message Data received : ", JSON.stringify(messageData));
    socket.to(messageData.room).emit("receive_message", messageData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
