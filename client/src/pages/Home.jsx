import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const createRoom = () => {
    if (!name) return alert("Please enter your name first! 🦄");
    const id = Math.random().toString(36).substring(2, 8);
    navigate(`/room/${id}`, { state: { name } });
  };

  const joinRoom = () => {
    if (!name || !roomId) return alert("Please enter both Name and Room ID! 🚨");
    navigate(`/room/${roomId}`, { state: { name } });
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Watch Party 🎥</h1>
        <p className="subtitle">Stream together with friends</p>
        
        {/* Input for Name */}
        <div className="input-group">
          <input 
            type="text"
            className="input-field"
            placeholder="Enter your name..." 
            value={name}
            onChange={e => setName(e.target.value)} 
          />
        </div>

        {/* Input for Room ID */}
        <div className="input-group">
          <input 
            type="text"
            className="input-field"
            placeholder="Enter Room ID (to join)..." 
            value={roomId}
            onChange={e => setRoomId(e.target.value)} 
          />
        </div>

        {/* Button Group */}
        <div className="btn-group">
          <button className="btn btn-primary" onClick={createRoom}>
            Create Room
          </button>
          <button className="btn btn-secondary" onClick={joinRoom}>
            Join Room
          </button>
        </div>

      </div>
    </div>
  );
}