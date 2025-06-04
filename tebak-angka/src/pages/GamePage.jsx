import React from "react";

function GamePage({
  currentRound,
  totalRounds,
  timeLeft,
  players,
  scores,
  playersGuessedStatus,
  guess,
  setGuess,
  hasGuessedThisRound,
  makeGuess,
  requestHint,
  aiHint,
  message,
}) {
  return (
    <div className="game-area">
      <div className="game-header">
        <h2>
          🎯 Tebak Angka - Ronde {currentRound}/{totalRounds}
        </h2>
        <div className="timer">⏰ {timeLeft}s</div>
      </div>

      <div className="scores">
        <h3>📊 Skor:</h3>
        {players.map((player) => (
          <div key={player.id} className="score-item">
            {player.name}: {scores[player.id] || 0}
            {playersGuessedStatus[player.id] && " ✅"}
          </div>
        ))}
      </div>

      <div className="game-info">
        <div className="guess-area">
          <input
            type="number"
            placeholder="Tebak angka (1-100)"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && makeGuess()}
            min="1"
            max="100"
            disabled={hasGuessedThisRound}
          />
          <button
            onClick={makeGuess}
            disabled={!guess.trim() || hasGuessedThisRound}
          >
            {hasGuessedThisRound ? "Sudah Menebak" : "Tebak!"}
          </button>
        </div>

        <button onClick={requestHint} className="hint-button">
          💡 Minta Hint AI
        </button>

        {aiHint && (
          <div className="ai-hint">
            <strong>🤖 AI Hint:</strong> {aiHint}
          </div>
        )}
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
}

export default GamePage;
