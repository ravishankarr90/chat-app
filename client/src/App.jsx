import "./App.css";
import { useContext, useState } from "react";
import { SiGooglechat } from "react-icons/si";

import Chat from "./components/Chat";
import Game from "./components/TicTacToe";

import AppContext from "./contexts/AppContext";

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowChat] = useState(false);
  const ctx = useContext(AppContext);

  const joinRoom = (event) => {
    event.preventDefault();
    if (name !== "" && room !== "") {
      console.log("Room Id to join : ", room);
      ctx.socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <AppContext.Provider value={{ ...ctx, name, room }}>
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
          <div className="app__main-container">
            <Game />
            <Chat />
          </div>
        )}
        <footer>
          <small> &copy; 2022 Ravishankar R. All rights reserved. </small>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;
