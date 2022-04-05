import { createContext } from "react";
import io from "socket.io-client";

let backendUrl = "http://localhost:3001";
console.log("Environment : ", process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  backendUrl = process.env.REACT_APP_BACKEND_URL;
}

console.log("Backend URL : ", backendUrl);
const socket = io.connect(backendUrl);

const AppContext = createContext({
  name: "",
  room: "",
  socket: socket,
});

export default AppContext;
