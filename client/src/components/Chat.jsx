import React, { useRef, useEffect, useState } from "react";
import { SiGooglechat } from "react-icons/si";
import telegramIcon from "../assets/telegram-plane.svg";

import ChatItem from "./ChatItem";

import "./Chat.css";

const Chat = ({ socket, name, room }) => {
  const messageRef = useRef();
  const [chatList, setChatList] = useState([]);

  const sendMessage = async () => {
    if (messageRef.current.value !== "") {
      const messageData = {
        author: name,
        room,
        message: messageRef.current.value,
        time: new Date().getTime(),
      };

      await socket.emit("send_message", messageData);
      messageData.self = true;
      setChatList((prevChatList) => {
        return [...prevChatList, messageData];
      });
      messageRef.current.value = "";
    }
  };

  useEffect(() => {
    socket.on("receive_message", (messageData) => {
      console.log("Message data received : ", JSON.stringify(messageData));
      setChatList((prevChatList) => {
        return [...prevChatList, messageData];
      });
    });
  }, [socket]);

  return (
    <div className="app__chat-container">
      <div className="app__chat-header">
        <SiGooglechat
          style={{
            marginLeft: "10px",
            marginRight: "auto",
            marginBottom: "10px",
          }}
          fontSize={"35px"}
        />

        <div className="app__chat-header_details">
          <p className="p__details">
            <strong>User</strong> : {name}
          </p>
          <p className="p__details">
            <strong>Room</strong> : {room}
          </p>
        </div>
      </div>
      <div className="app__chat-body">
        {chatList.map((chat) => (
          <ChatItem
            message={chat.message}
            author={chat.author}
            self={chat.self}
            key={chat.time}
            time={chat.time}
          />
        ))}
      </div>
      <div className="app__chat-footer">
        <textarea
          className="app__chat-message"
          type="text"
          placeholder="Message..."
          ref={messageRef}
        ></textarea>
        <button className="app__chat-send-btn" onClick={sendMessage}>
          <img
            src={telegramIcon}
            alt="message send icon"
            className="msg_send_icon"
          />
        </button>
      </div>
    </div>
  );
};

export default Chat;
