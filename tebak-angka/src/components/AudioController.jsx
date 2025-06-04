import React, { useState, useEffect } from "react";
import { useAudio } from "../contexts/AudioContext";
import "./AudioController.css";

const AudioController = () => {
  const {
    isMusicEnabled,
    setIsMusicEnabled,
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    audioInitialized,
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    resumeBackgroundMusic, // Add this
  } = useAudio();

  const [isMinimized, setIsMinimized] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");

  // Debug function to test audio
  const testAudio = () => {
    console.log("Testing audio...");
    console.log("Audio initialized:", audioInitialized);
    console.log("Music enabled:", isMusicEnabled);
    console.log("Music volume:", musicVolume);
    console.log("SFX volume:", sfxVolume);

    // Test playing a sound
    try {
      playCorrectSound();
      setDebugInfo("Sound test attempted - check console for errors");
    } catch (error) {
      console.error("Test sound failed:", error);
      setDebugInfo("Sound test failed: " + error.message);
    }
  };

  // Handle music toggle with better volume management
  // Handle music toggle - use playBackgroundMusic instead of resume
  const handleMusicToggle = () => {
    console.log("Music toggle clicked. Current state:", isMusicEnabled);
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);

    if (newState) {
      console.log("Starting background music with volume:", musicVolume);
      playBackgroundMusic(); // Use the original function that works
    } else {
      console.log("Stopping background music...");
      stopBackgroundMusic();
    }
  };

  // Handle volume changes with immediate effect
  // Handle volume changes WITHOUT restarting music
  // Simplified version - just update volume, let useEffect handle the rest
  const handleMusicVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    console.log("Music volume changed to:", newVolume);
    setMusicVolume(newVolume);
    // That's it! No need to restart music
  };

  const handleSfxVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    console.log("SFX volume changed to:", newVolume);
    setSfxVolume(newVolume);
  };

  return (
    <div className={`audio-controller ${isMinimized ? "minimized" : ""}`}>
      <div
        className="audio-header"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        <div className="audio-title">
          <span className="audio-icon">🎵</span>
          Audio Settings
        </div>
        <span className="minimize-icon">{isMinimized ? "▲" : "▼"}</span>
      </div>

      {!isMinimized && (
        <div className="audio-controls">
          {/* Debug Section */}
          <div className="control-group">
            <button onClick={testAudio} className="debug-btn">
              🔧 Test Audio
            </button>
            {debugInfo && <div className="debug-info">{debugInfo}</div>}
          </div>

          {/* Music Control */}
          <div className="control-group">
            <div className="control-header">
              <div className="control-label">
                <span className="control-icon">🎵</span>
                Background Music
              </div>
              <button
                className={`toggle-btn ${isMusicEnabled ? "active" : ""}`}
                onClick={handleMusicToggle}
              >
                {isMusicEnabled ? "ON" : "OFF"}
              </button>
            </div>
            <div className="volume-control">
              <span className="volume-label">🔉</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={musicVolume}
                onChange={handleMusicVolumeChange}
                disabled={!isMusicEnabled}
              />
              <span className="volume-value">{musicVolume}%</span>
            </div>
          </div>

          {/* SFX Control */}
          <div className="control-group">
            <div className="control-header">
              <div className="control-label">
                <span className="control-icon">🔊</span>
                Sound Effects
              </div>
              <button
                className={`toggle-btn ${sfxVolume > 0 ? "active" : ""}`}
                onClick={() => setSfxVolume(sfxVolume > 0 ? 0 : 50)}
              >
                {sfxVolume > 0 ? "ON" : "OFF"}
              </button>
            </div>
            <div className="volume-control">
              <span className="volume-label">🔉</span>
              <input
                type="range"
                className="volume-slider"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={handleSfxVolumeChange}
              />
              <span className="volume-value">{sfxVolume}%</span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="audio-status">
            <span
              className={`status-indicator ${
                audioInitialized ? "ready" : "loading"
              }`}
            >
              {audioInitialized ? "✅ Audio Ready" : "⏳ Loading Audio..."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioController;
