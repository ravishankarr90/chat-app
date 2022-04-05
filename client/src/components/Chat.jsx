import React, { useRef, useEffect, useState, useContext } from "react";
import { SiGooglechat } from "react-icons/si";
import ScrollToBottom from "react-scroll-to-bottom";

import telegramIcon from "../assets/telegram-plane.svg";

import ChatItem from "./ChatItem";

import "./Chat.css";
import AppContext from "../contexts/AppContext";

const Chat = () => {
  const messageRef = useRef();
  const socketCtx = useContext(AppContext);
  const [chatList, setChatList] = useState([]);

  const { name, room, socket } = socketCtx;

  const sendMessage = async () => {
    if (messageRef.current.value !== "") {
      const messageData = {
        author: name,
        room,
        message: messageRef.current.value,
        time: new Date().getTime(),
      };

      await socket.emit("send_message", messageData);
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

    return () => socket.off("receive_message");
  });

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
        <ScrollToBottom className="app__chat-body">
          {chatList.map((chat) => {
            return chat.author === name ? (
              <ChatItem
                message={chat.message}
                author={chat.author}
                self={true}
                key={chat.time}
                time={chat.time}
              />
            ) : (
              <ChatItem
                message={chat.message}
                author={chat.author}
                self={false}
                key={chat.time}
                time={chat.time}
              />
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="app__chat-footer">
        <input
          className="app__chat-message"
          type="text"
          placeholder="Message..."
          ref={messageRef}
          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
        />
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
