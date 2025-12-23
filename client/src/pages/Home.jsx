import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    if (!name) return alert("Enter name");
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${id}`, { state: { name } });
  };

  const joinRoom = () => {
    if (!name || !room) return alert("Fill all fields");
    navigate(`/room/${room}`, { state: { name } });
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>WatchParty</h1>
        <p>Watch YouTube together. In sync.</p>

        <input placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
        <br /><br />
        <input placeholder="Room ID" value={room} onChange={e => setRoom(e.target.value)} />
        <br /><br />

        <button onClick={createRoom}>Create Room</button>
        <span style={{ margin: "0 8px" }} />
        <button onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#5f6274ff",
    padding: 32,
    borderRadius: 14,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    textAlign: "center",
  },
};
