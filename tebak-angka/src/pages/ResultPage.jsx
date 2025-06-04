import React from "react";

function ResultPage({ gameResult, scores, players, resetGame }) {
  return (
    <div className="game-finished">
      <h2>🎉 Game Selesai!</h2>

      {gameResult?.type === "winner" && (
        <div className="winner">
          <h3>🏆 Selamat! Anda Menang!</h3>
          <p>{gameResult.message}</p>
        </div>
      )}

      {gameResult?.type === "lose" && (
        <div className="loser">
          <h3>😔 Anda Kalah!</h3>
          <p>{gameResult.message}</p>
        </div>
      )}

      {gameResult?.type === "tie" && (
        <div className="tie">
          <h3>🤝 Permainan Seri!</h3>
          <p>{gameResult.message}</p>
        </div>
      )}

      {gameResult?.type === "draw" && (
        <div className="draw">
          <h3>😅 Tidak Ada Pemenang!</h3>
          <p>{gameResult.message}</p>
        </div>
      )}

      <div className="final-scores">
        <h3>📊 Skor Akhir:</h3>
        {Object.entries(scores)
          .sort(([, a], [, b]) => b - a)
          .map(([playerId, score]) => {
            const player = players.find((p) => p.id === playerId);
            return (
              <div key={playerId} className="final-score-item">
                {player?.name}: {score}
              </div>
            );
          })}
      </div>

      <button onClick={resetGame} className="play-again-button">
        🔄 Main Lagi
      </button>
    </div>
  );
}

export default ResultPage;
