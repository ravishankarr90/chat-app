import "./App.css";
import { useContext, useState, useEffect } from "react";
import { SiGooglechat } from "react-icons/si";

import { Chat, TicTacToe } from "./components";

import AppContext from "./contexts/AppContext";

function App() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [showchat, setShowChat] = useState(false);
  const ctx = useContext(AppContext);
  const { socket } = ctx;

  const joinRoom = (event) => {
    event.preventDefault();
    if (name !== "" && room !== "") {
      socket.emit("join_room", room, (confirmation) => {
        setShowChat(true);
      });
    }
  };

  useEffect(() => {
    socket.on("room_full", (roomFull) => {
      if (roomFull) {
        alert("Room is full");
      }
    });

    return () => socket.off("room_full");
  });

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
            <TicTacToe />
            <Chat />
          </div>
        )}
        <footer>
          <small>
            {" "}
            &copy; 2022{" "}
            <a
              className="footer__link"
              href="https://github.com/ravishankarr90/chat-app"
            >
              Ravishankar R
            </a>{" "}
            All rights reserved.{" "}
          </small>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;
