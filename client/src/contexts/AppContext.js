import { createContext } from "react";
import io from "socket.io-client";

let backendUrl = "http://localhost:3001";
if (process.env.NODE_ENV === "production") {
  backendUrl = process.env.REACT_APP_BACKEND_URL;
}

const socket = io.connect(backendUrl);

const AppContext = createContext({
  name: "",
  room: "",
  socket: socket,
});

export default AppContext;
