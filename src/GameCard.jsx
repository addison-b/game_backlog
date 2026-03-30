function GameCard({ title, genre, played, onToggle }) {
  return (
    <li
      style={{
        marginBottom: "12px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <strong style={{ minWidth: "180px" }}>{title}</strong>
      <span style={{ color: "grey", minWidth: "120px" }}>{genre}</span>
      <button onClick={onToggle}>
        {played ? "✅ Played" : "⬜️ Not Played"}
      </button>
    </li>
  );
}

export default GameCard;
