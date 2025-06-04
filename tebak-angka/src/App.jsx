import './App.css'
import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import io from "socket.io-client";
import { useAudio } from "./contexts/AudioContext";
import AudioController from "./components/AudioController";
import MenuPage from "./pages/MenuPage";
import GamePage from "./pages/GamePage";
import ResultPage from "./pages/ResultPage";

const socket = io("https://api.jessicarachel.site");

function App() {
  const [gameState, setGameState] = useState("menu");
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isRoomMaster, setIsRoomMaster] = useState(false);
  const [players, setPlayers] = useState([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalRounds, setTotalRounds] = useState(3);
  const [scores, setScores] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [guess, setGuess] = useState("");
  const [message, setMessage] = useState("");
  const [aiHint, setAiHint] = useState("");
  const [gameResult, setGameResult] = useState(null);
  const [timerRef, setTimerRef] = useState(null);
  const [hasGuessedThisRound, setHasGuessedThisRound] = useState(false);
  const [playersGuessedStatus, setPlayersGuessedStatus] = useState({});


  // Audio functions ref, Audio refs, Audio management functions, Initialize audio on component mount

  useEffect(() => {
    socket.on("joinedRoom", (data) => {
      setRoomId(data.roomId);
      setIsRoomMaster(data.isRoomMaster);
      setPlayers(data.players);
      setGameState("waiting");
    });

    socket.on("playerJoined", (data) => {
      setPlayers(data.players);
      setMessage(`${data.player.name} bergabung ke room`);
    });

    socket.on("playerLeft", (data) => {
      setPlayers(data.players);
      if (data.wasRoomMaster && data.players.length > 0) {
        const newRoomMaster = data.players[0];
        if (newRoomMaster.id === socket.id) {
          setIsRoomMaster(true);
          setMessage(
            `${data.player.name} keluar dari room. Anda sekarang menjadi room master!`
          );
        } else {
          setMessage(
            `${data.player.name} keluar dari room. ${newRoomMaster.name} sekarang menjadi room master.`
          );
        }
      } else {
        setMessage(`${data.player.name} keluar dari room`);
      }
    });

    socket.on("roomMasterChanged", (data) => {
      if (data.newRoomMaster.id === socket.id) {
        setIsRoomMaster(true);
      }
      setMessage(data.message);
    });

    socket.on("gameStarted", (data) => {
      setGameState("playing");
      setCurrentRound(data.round);
      setTotalRounds(data.totalRounds);
      setMessage("Game dimulai!");
      setAiHint("");
    });

    socket.on("playerTurn", (data) => {
      setCurrentPlayer(data.playerName);
      setTimeLeft(data.timeLeft);
      setMessage(`Giliran ${data.playerName} menebak angka (1-100)`);
      setAiHint("");

      if (data.playerId === socket.id) {
        setMessage("Giliran Anda! Tebak angka 1-100");
      }

      if (timerRef) {
        clearInterval(timerRef);
      }

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      setTimerRef(timer);
    });

    socket.on("correctGuess", (data) => {
      setMessage(
        `${data.playerName} berhasil menebak angka ${data.targetNumber}!`
      );
      setGuess("");
      playCorrectSound();
    });

    socket.on("wrongGuess", (data) => {
      if (data.targetNumber !== null) {
        setMessage(
          `${data.playerName} menebak ${data.guess}, salah! Angka yang benar: ${data.targetNumber}`
        );
      } else {
        setMessage(`${data.playerName} menebak ${data.guess}, salah!`);
      }
      setGuess("");
      playWrongSound();
    });

    socket.on("playerTimeout", (data) => {
      setMessage(
        `⏰ Waktu ${data.playerName} habis! Angka yang benar: ${data.targetNumber}`
      );
      setGuess("");
      playWrongSound();
    });

    socket.on("roundEnd", (data) => {
      setScores(data.scores);
      setCurrentRound(data.round + 1);
      setAiHint("");

      if (data.winner) {
        const winner = players.find((p) => p.id === data.winner);
        setMessage(`Ronde ${data.round} selesai! Pemenang: ${winner?.name}`);
      } else {
        setMessage(
          `Ronde ${data.round} selesai! Tidak ada yang menebak dengan benar.`
        );
      }
    });

    socket.on("allPlayersGuessed", (data) => {
      setMessage(data.message + ` Angka yang benar: ${data.targetNumber}`);
      playWrongSound();
    });

    socket.on("gameEnd", (data) => {
      setGameState("finished");
      setGameResult(data.result);
      setScores(data.finalScores);

      if (data.result.type === "winner") {
        playVictorySound();
      } else if (data.result.type === "lose") {
        playDefeatSound();
      } else if (data.result.type === "tie") {
        playVictorySound();
      } else {
        playBackgroundMusic();
      }
    });

    socket.on("roundStarted", (data) => {
      setCurrentRound(data.round);
      setTimeLeft(data.timeLeft);
      setMessage(data.message);
      setAiHint("");
      setHasGuessedThisRound(false);
      setPlayersGuessedStatus({});
    });

    socket.on("timerUpdate", (data) => {
      setTimeLeft(data.timeLeft);
    });

    socket.on("playerGuessed", (data) => {
      setPlayersGuessedStatus((prev) => ({
        ...prev,
        [data.playerId]: true,
      }));
    });

    socket.on("playersTimeout", (data) => {
      setMessage(
        `⏰ Waktu habis! Player yang tidak menebak: ${data.players.join(
          ", "
        )}. Angka yang benar: ${data.targetNumber}`
      );
      playWrongSound();
    });

    socket.on("aiHint", (hint) => {
      setAiHint(hint);
    });

    return () => {
      if (timerRef) {
        clearInterval(timerRef);
      }
      socket.off("joinedRoom");
      socket.off("playerJoined");
      socket.off("playerLeft");
      socket.off("roomMasterChanged");
      socket.off("gameStarted");
      socket.off("playerTurn");
      socket.off("correctGuess");
      socket.off("wrongGuess");
      socket.off("playerTimeout");
      socket.off("roundEnd");
      socket.off("gameEnd");
      socket.off("aiHint");
      socket.off("allPlayersGuessed");
      socket.off("roundStarted");
      socket.off("timerUpdate");
      socket.off("playerGuessed");
      socket.off("playersTimeout");
    };
  }, [timerRef, players]);

  const joinGame = () => {
    if (playerName.trim()) {
      socket.emit("joinGame", playerName.trim());
    }
  };

  const startGame = () => {
    socket.emit("startGame");
  };

  const makeGuess = () => {
    if (guess.trim() && !hasGuessedThisRound) {
      socket.emit("makeGuess", guess.trim());
      setHasGuessedThisRound(true);
    }
  };

  const requestHint = () => {
    socket.emit("requestHint");
  };

  const resetGame = () => {
    stopAllGameEndSounds();
    socket.disconnect();

    setGameState("menu");
    setPlayerName("");
    setRoomId("");
    setIsRoomMaster(false);
    setPlayers([]);
    setCurrentRound(0);
    setTotalRounds(3);
    setScores({});
    setCurrentPlayer(null);
    setTimeLeft(0);
    setGuess("");
    setMessage("");
    setAiHint("");
    setGameResult(null);

    if (timerRef) {
      clearInterval(timerRef);
      setTimerRef(null);
    }

    setTimeout(() => {
      socket.connect();
      playBackgroundMusic();
    }, 100);
  };

   // Props untuk komponen 

  return (

    <>
      <h1></h1>
    </>
  )
}

export default App
