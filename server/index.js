const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const { Server } = require("socket.io");
const port = process.env.PORT || 3001;
const globalGameData = {};
const globalUsersForRooms = {};
const globalSocketData = {};

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

  socket.on("join_room", ({ room, name }, callback) => {
    let safeToJoin = true;
    console.log(
      "Joining room : ",
      room,
      " User Id : ",
      socket.id,
      " Name : ",
      name
    );

    if (!globalUsersForRooms[room]) {
      globalUsersForRooms[room] = [];
    }

    if (
      globalUsersForRooms[room] &&
      globalUsersForRooms[room].indexOf(name) > -1
    ) {
      safeToJoin = false;
    }

    if (safeToJoin) {
      const clients = io.sockets.adapter.rooms.get(room);
      const numClientsConnected = clients ? clients.size : 0;
      if (numClientsConnected < 2) {
        globalUsersForRooms[room].push(name);
        globalSocketData[socket.id] = {
          name,
          room,
        };
        socket.join(room);
        callback("success");
      } else {
        io.to(socket.id).emit("join_error", "Room is full.");
      }
    } else {
      io.to(socket.id).emit("join_error", "Name already taken in the room.");
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

    if (!globalGameData[gameData.room]) {
      globalGameData[gameData.room] = {};
      globalGameData[gameData.room][gameData.value] = gameData.name;
    } else if (!globalGameData[gameData.room][gameData.name]) {
      globalGameData[gameData.room][gameData.value] = gameData.name;
    }

    //socket.to(room).emit("game_data_for_room", cellData);
    io.in(gameData.room).emit("game_data_for_room", gameData);
  });

  socket.on("game_winner", ({ winner, room }) => {
    const roomData = globalGameData[room];
    let winnerName = "Draw";
    if (winner !== "XY") {
      winnerName = roomData[winner];
    }
    io.in(room).emit("receive_winner", winnerName);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected : ${socket.id}`);
    if (globalSocketData[socket.id]) {
      const { room, name } = globalSocketData[socket.id];
      const usersInRoom = globalUsersForRooms[room];
      const gameDataForRoom = globalGameData[room];
      delete globalGameData[room];
      usersInRoom.splice(usersInRoom.indexOf(name), 1);

      io.in(room).emit("game_ended", "Game ended as other user left the room");
    }
  });
});

app.get("/", (req, res) => {
  res.send(`Hello !!! Server running on ${port}`);
});

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
