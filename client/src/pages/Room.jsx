import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import socket from "../socket";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import "./Room.css"; // Create this file

export default function Room() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.name || "Guest"; // Fallback if direct link used

  const [isHost, setIsHost] = useState(false);
  const [videoId, setVideoId] = useState("");

  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      socket.emit("join-room", { roomId, username });
    });

    socket.on("room-state", (state) => {
      setIsHost(state.hostId === socket.id);
    });

    socket.on("video-changed", (id) => {
      setVideoId(id);
    });

    return () => socket.disconnect();
  }, [roomId, username]);

  const changeVideo = () => {
    const url = prompt("Paste YouTube URL");
    if (!url) return;
    const id = url.split("v=")[1]?.split("&")[0];
    if (!id) return alert("Invalid YouTube URL");

    socket.emit("set-video", { roomId, videoId: id });
  };

  return (
    <div className="room-container">
      {/* Header Bar */}
      <header className="glass-header">
        <div className="header-left">
          <h1>📺 Room: <span>{roomId}</span></h1>
        </div>
        
        <div className="header-right">
          <span className="user-badge">👤 {username}</span>
          {isHost && (
            <button className="btn-action" onClick={changeVideo}>
              Change Video 🎬
            </button>
          )}
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="room-grid">
        {/* Left: Video Player */}
        <div className="video-box glass-panel">
            <VideoPlayer videoId={videoId} />
        </div>

        {/* Right: Chat */}
        <div className="chat-box glass-panel">
          <Chat roomId={roomId} username={username} />
        </div>
      </div>
    </div>
  );
}