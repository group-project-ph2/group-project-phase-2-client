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
  
  return (

    <>
      <h1></h1>
    </>
  )
}

export default App
