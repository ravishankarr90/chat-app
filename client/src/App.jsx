import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import { SiGooglechat } from "react-icons/si";

import Chat from "./components/Chat";

let backendUrl = "http://localhost:3001";
console.log("Environment : ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  backendUrl = process.env.BACKEND_URL;
}

console.log("Backend URL : ", backendUrl);
const socket = io.connect(backendUrl);

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowChat] = useState(false);

  const joinRoom = (event) => {
    event.preventDefault();
    if (name !== "" && room !== "") {
      console.log("Room Id to join : ", room);
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="app">
      {!showchat ? (
        <form className="app__chat-details" onSubmit={joinRoom}>
          <h3 className="app__title">
            Chat Buddy
            <SiGooglechat style={{ marginLeft: "10px" }} />
          </h3>
          <input
            className="app__chat-details_input"
            placeholder="Name"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            className="app__chat-details_input"
            placeholder="Room ID"
            onChange={(event) => setRoom(event.target.value)}
          />
          <button className="app__chat-details_button" type="submit">
            Join Room
          </button>
        </form>
      ) : (
        <Chat socket={socket} name={name} room={room} />
      )}
      <footer>
        <small> &copy; 2022 Ravishankar R. All rights reserved. </small>
      </footer>
    </div>
  );
}

export default App;
