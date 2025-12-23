export default function Layout({ children }) {
  return (
    <div>
      <header style={styles.header}>
        <h2>🎬 WatchParty</h2>
        <span style={styles.tag}>LIVE</span>
      </header>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  header: {
    height: 64,
    background: "#59595aff",
    display: "flex",
    alignItems: "center",
    padding: "0 24px",
    borderBottom: "1px solid #2a2c36",
    gap: 12,
  },
  tag: {
    background: "#dc6365ff",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  main: {
    padding: 24,
  },
};
