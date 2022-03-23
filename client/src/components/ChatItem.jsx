import React from "react";

import "./ChatItem.css";

const ChatItem = ({ message, author, self, time }) => {
  const formattedTime = new Date(time).toLocaleString();

  return (
    <div className={self ? "my__msg" : "other__msg"}>
      <p className="chat__message">{message}</p>
      <p className="chat__time">{formattedTime}</p>
    </div>
  );
};

export default ChatItem;
