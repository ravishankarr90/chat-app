import React, { useState, useContext, useEffect } from "react";
import TicTacToeCell from "./TicTacToeCell";
import AppContext from "../contexts/AppContext";

import "./TicTacToe.css";

const checkWinner = (gameData) => {
  let winnerObj = {};
  const winLocations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < winLocations.length; i++) {
    let combination = winLocations[i];
    if (
      gameData[combination[0]] &&
      gameData[combination[1]] &&
      gameData[combination[2]] &&
      gameData[combination[0]] === gameData[combination[1]] &&
      gameData[combination[1]] === gameData[combination[2]]
    ) {
      winnerObj = { indices: combination, winner: gameData[combination[0]] };
      break;
    }
  }

  return winnerObj;
};

const TicTacToe = () => {
  const ctx = useContext(AppContext);

  const { socket, room, name } = ctx;

  const [gameData, setGameData] = useState(Array(9).fill(""));
  const [nextIsX, setNextIsX] = useState(true);
  const [playable, setPlayable] = useState(true);
  const [winLocations, setWinLocations] = useState([]);

  const handleCellClick = async (cellIndex) => {
    if (playable) {
      const cellValue = nextIsX ? "X" : "O";
      setPlayable(false);

      await socket.emit("game_data", {
        index: cellIndex,
        value: cellValue,
        room,
        name,
      });
    }
  };

  useEffect(() => {
    socket.on("game_data_for_room", (gameDataReceived) => {
      console.log("Game data received : ", JSON.stringify(gameDataReceived));
      setGameData((prevGameData) => {
        const tempArr = [...prevGameData];
        tempArr[gameDataReceived.index] = gameDataReceived.value;
        return tempArr;
      });

      if (gameDataReceived.name !== name) {
        setPlayable(true);
        gameDataReceived.value === "X" ? setNextIsX(false) : setNextIsX(true);
      }

      //alert("Game Data Received : ", gameDataReceived);
    });

    return () => socket.off("game_data_for_room");
  });

  useEffect(() => {
    const winnerObj = checkWinner(gameData);
    if (winnerObj.winner) {
      setWinLocations([...winnerObj.indices]);
      setPlayable(false);
    }
  }, [gameData]);

  return (
    <div className="tictactoe__board">
      {gameData.map((cellValue, index) => (
        <TicTacToeCell
          key={index}
          index={index}
          cellClickHandler={handleCellClick}
          winCell={winLocations.indexOf(index) > -1}
        >
          {cellValue}
        </TicTacToeCell>
      ))}
    </div>
  );
};

export default TicTacToe;
