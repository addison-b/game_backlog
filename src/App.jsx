import { useEffect, useState } from "react";
import GameCard from "./GameCard";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  useEffect(() => {
    async function loadGames() {
      try {
        const response = await fetch("http://127.0.0.1:8000/games");
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        const data = await response.json();
        setGames(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadGames();
  }, [fetchTrigger]);

  /*
  function togglePlayed(id) {
    setGames(
      games.map((game) =>
        game.id === id ? { ...game, played: !game.played } : game,
      ),
    );
  }
*/

  if (loading) return <p>Loading games...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h3>🎮 Game Tracker</h3>
      <h6 style={{ color: "gray" }}>{games.length} games in backlog</h6>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {games.map((game) => (
          <GameCard
            key={game.id}
            title={game.title}
            genre={game.genre}
            played={game.played}
          />
        ))}
      </ul>
      <button onClick={() => setFetchTrigger((n) => n + 1)}>Try Again</button>
    </div>
  );
}

export default App;
