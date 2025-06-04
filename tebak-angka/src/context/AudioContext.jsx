import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

const AudioContext = createContext();

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Audio refs
  const backgroundMusicRef = useRef(null);
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const victorySoundRef = useRef(null);
  const defeatSoundRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    const initializeAudio = () => {
      try {
        backgroundMusicRef.current = new Audio("/sounds/background-music.mp3");
        correctSoundRef.current = new Audio("/sounds/correct-answer.mp3");
        wrongSoundRef.current = new Audio("/sounds/wrong-answer.mp3");
        victorySoundRef.current = new Audio("/sounds/victory.mp3");
        defeatSoundRef.current = new Audio("/sounds/defeat.mp3");

        // Configure audio
        backgroundMusicRef.current.loop = true;
        victorySoundRef.current.loop = true;
        defeatSoundRef.current.loop = true;

        setAudioInitialized(true);
      } catch (error) {
        console.error("Audio initialization failed:", error);
        setAudioInitialized(false);
      }
    };

    initializeAudio();
  }, []);

  // Update volumes - this should work properly now
  useEffect(() => {
    if (audioInitialized && backgroundMusicRef.current) {
      const newVolume = Math.min(musicVolume / 100, 1.0);
      backgroundMusicRef.current.volume = newVolume;
      console.log("Background music volume updated to:", newVolume);
    }
  }, [musicVolume, audioInitialized]);

  // Modified playBackgroundMusic - don't reset currentTime if already playing
  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && isMusicEnabled && audioInitialized) {
      try {
        // Set volume
        backgroundMusicRef.current.volume = Math.min(musicVolume / 100, 1.0);

        // Only reset currentTime if music is completely stopped/paused
        if (
          backgroundMusicRef.current.paused ||
          backgroundMusicRef.current.ended
        ) {
          backgroundMusicRef.current.currentTime = 0;
        }

        backgroundMusicRef.current
          .play()
          .catch((e) => console.log("Background music play failed:", e));
      } catch (error) {
        console.error("Error playing background music:", error);
      }
    }
  }, [isMusicEnabled, audioInitialized, musicVolume]); // Add musicVolume to dependencies

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      } catch (error) {
        console.error("Error stopping background music:", error);
      }
    }
  }, []);

  // Update the volume effect to also restart music if it's currently playing
  useEffect(() => {
    if (audioInitialized && backgroundMusicRef.current) {
      const newVolume = Math.min(musicVolume / 100, 1.0);
      backgroundMusicRef.current.volume = newVolume;

      // If music is currently playing and enabled, ensure volume is applied
      if (isMusicEnabled && !backgroundMusicRef.current.paused) {
        console.log("Updating background music volume to:", newVolume);
      }
    }
  }, [musicVolume, audioInitialized, isMusicEnabled]);

  const playCorrectSound = useCallback(() => {
    if (correctSoundRef.current && sfxVolume > 0 && audioInitialized) {
      try {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current
          .play()
          .catch((e) => console.log("Correct sound play failed:", e));
      } catch (error) {
        console.error("Error playing correct sound:", error);
      }
    }
  }, [sfxVolume, audioInitialized]);

  const playWrongSound = useCallback(() => {
    if (wrongSoundRef.current && sfxVolume > 0 && audioInitialized) {
      try {
        wrongSoundRef.current.currentTime = 0;
        wrongSoundRef.current
          .play()
          .catch((e) => console.log("Wrong sound play failed:", e));
      } catch (error) {
        console.error("Error playing wrong sound:", error);
      }
    }
  }, [sfxVolume, audioInitialized]);

  const playVictorySound = useCallback(() => {
    stopBackgroundMusic();
    if (victorySoundRef.current && sfxVolume > 0 && audioInitialized) {
      try {
        victorySoundRef.current.currentTime = 0;
        victorySoundRef.current
          .play()
          .catch((e) => console.log("Victory sound play failed:", e));
      } catch (error) {
        console.error("Error playing victory sound:", error);
      }
    }
  }, [sfxVolume, audioInitialized, stopBackgroundMusic]);

  const playDefeatSound = useCallback(() => {
    stopBackgroundMusic();
    if (defeatSoundRef.current && sfxVolume > 0 && audioInitialized) {
      try {
        defeatSoundRef.current.currentTime = 0;
        defeatSoundRef.current
          .play()
          .catch((e) => console.log("Defeat sound play failed:", e));
      } catch (error) {
        console.error("Error playing defeat sound:", error);
      }
    }
  }, [sfxVolume, audioInitialized, stopBackgroundMusic]);

  const stopGameEndSounds = useCallback(() => {
    try {
      if (victorySoundRef.current) {
        victorySoundRef.current.pause();
        victorySoundRef.current.currentTime = 0;
      }
      if (defeatSoundRef.current) {
        defeatSoundRef.current.pause();
        defeatSoundRef.current.currentTime = 0;
      }
    } catch (error) {
      console.error("Error stopping game end sounds:", error);
    }
  }, []);

  // New function to resume music without restarting
  const resumeBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && isMusicEnabled && audioInitialized) {
      try {
        // Set volume
        backgroundMusicRef.current.volume = Math.min(musicVolume / 100, 1.0);

        // Don't reset currentTime - just play from current position
        if (backgroundMusicRef.current.paused) {
          backgroundMusicRef.current
            .play()
            .catch((e) => console.log("Background music resume failed:", e));
        }
      } catch (error) {
        console.error("Error resuming background music:", error);
      }
    }
  }, [isMusicEnabled, audioInitialized, musicVolume]);

  // Add to context value
  const value = {
    // States
    isMusicEnabled,
    setIsMusicEnabled,
    musicVolume,
    setMusicVolume,
    sfxVolume,
    setSfxVolume,
    audioInitialized,

    // Functions
    playBackgroundMusic,
    stopBackgroundMusic,
    playCorrectSound,
    playWrongSound,
    playVictorySound,
    playDefeatSound,
    stopGameEndSounds,
    resumeBackgroundMusic, // Add this new function
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};
