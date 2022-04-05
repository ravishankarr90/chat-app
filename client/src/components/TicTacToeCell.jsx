import React from "react";

import "./TicTacToeCell.css";

const TicTacToeCell = ({ index, children, winCell, cellClickHandler }) => {
  const sendCellClick = (event) => {
    if (event.target.innerHTML === "") {
      cellClickHandler(Number(event.currentTarget.getAttribute("index")));
    }
  };

  return (
    <button
      index={index}
      className={`tictactoe__cell ${winCell ? "winner" : "normal"}`}
      onClick={sendCellClick}
    >
      {children}
    </button>
  );
};

export default TicTacToeCell;
