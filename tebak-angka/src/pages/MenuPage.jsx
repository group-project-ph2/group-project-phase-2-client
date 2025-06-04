import React from "react";

function MenuPage({
  gameState,
  playerName,
  setPlayerName,
  roomId,
  isRoomMaster,
  players,
  message,
  joinGame,
  startGame,
}) {
  if (gameState === "menu") {
    return (
      <div className="menu">
        <h1>🎯 Tebak Angka Multiplayer</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Masukkan nama Anda"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && joinGame()}
          />
          <button onClick={joinGame} disabled={!playerName.trim()}>
            Bergabung ke Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "waiting") {
    return (
      <div className="waiting-room">
        <h2>🏠 Room: {roomId}</h2>
        <div className="players-list">
          <h3>Pemain ({players.length}/4):</h3>
          {players.map((player, index) => (
            <div
              key={player.id}
              className={`player ${index === 0 ? "room-master" : ""}`}
            >
              {player.name} {index === 0 && "👑"}
            </div>
          ))}
        </div>

        {isRoomMaster && (
          <button
            onClick={startGame}
            disabled={players.length < 2}
            className="start-button"
          >
            {players.length < 2 ? "Menunggu pemain lain..." : "Mulai Game"}
          </button>
        )}

        {!isRoomMaster && <p>Menunggu room master memulai game...</p>}

        {message && <div className="message">{message}</div>}
      </div>
    );
  }

  return null;
}

export default MenuPage;
