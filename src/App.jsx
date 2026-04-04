import { useEffect, useState } from "react";
import GameCard from "./GameCard";

function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newGenre, setNewGenre] = useState("")

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

  async function handleAddGame() {
    if (!newTitle.trim() || !newGenre.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, played: false, genre: newGenre }),
      });

      if (!response.ok) throw new Error('Server error: ${response.status}');

      const addedGame = await response.json();
      setGames([...games, addedGame]);
      setNewTitle("");
      setNewGenre("");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading games...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h3>🎮 Game Tracker</h3>
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <input
         type="text"
         placeholder="Title"
         value={newTitle}
         onChange={(e) => setNewTitle(e.target.value)}
         style={{ padding: "6px", fontSize: "14px" }}
         />
        <input
         type="text"
         placeholder="Genre"
         value={newGenre}
         onChange={(e) => setNewGenre(e.target.value)}
         style={{ padding: "6px", fontSize: "14px" }}
         />
         <button 
          onClick={handleAddGame} 
          disabled={submitting}
          style={{ padding: "6px 12px"}}
         >
          {submitting ? "Adding..." : "Add Game"}
         </button>

         {submitError && (
          <p style={{ color: "red" }}>{submitError}</p>
         )}
      </div>
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
