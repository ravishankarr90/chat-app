const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;

app.use(cors());

const server = http.createServer(app);

console.log("Environment : ", process.env.NODE_ENV);

let io = null;
if (process.env.NODE_ENV !== "production") {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });
} else {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
    },
  });
}

io.on("connection", (socket) => {
  console.log(`User connected ID : ${socket.id}`);

  socket.on("join_room", (data, callback) => {
    console.log("Joining room : ", data, " User Id : ", socket.id);
    const clients = io.sockets.adapter.rooms.get(data);
    const numClientsConnected = clients ? clients.size : 0;
    if (numClientsConnected < 2) {
      socket.join(data);
      callback("success");
    } else {
      io.to(socket.id).emit("room_full", true);
    }
  });

  socket.on("send_message", (messageData) => {
    console.log("Message Data received : ", JSON.stringify(messageData));
    //socket.to(messageData.room).emit("receive_message", messageData);
    io.in(messageData.room).emit("receive_message", messageData); //send message to all users in a room
  });

  socket.on("game_data", (gameData) => {
    console.log(
      "Game data received : index",
      gameData.index,
      " value : ",
      gameData.value,
      " for Room  : ",
      gameData.room,
      " for Name : ",
      gameData.name
    );
    //socket.to(room).emit("game_data_for_room", cellData);
    io.in(gameData.room).emit("game_data_for_room", gameData);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
  });
});

app.get("/", (req, res) => {
  res.send(`Hello !!! Server running on ${port}`);
});

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
