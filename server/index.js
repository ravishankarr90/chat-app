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

app.get("/", (req, res) => {
  res.send(`Hello !!! Server running on ${port}`);
});

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
