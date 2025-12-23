import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import VideoPlayer from "../components/VideoPlayer";
import Chat from "../components/Chat";
import socket from "../socket";

export default function Room() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const username = state?.name;

  const [videoId, setVideoId] = useState("");
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    socket.emit("join-room", { roomId, username });

    socket.on("room-state", s => {
      setIsHost(s.hostId === socket.id);
      if (s.videoId) setVideoId(s.videoId);
    });

    socket.on("video-changed", id => setVideoId(id));

    return () => {
      socket.off("room-state");
      socket.off("video-changed");
    };
  }, []);

  const setVideo = () => {
    const url = prompt("Paste YouTube URL");
    const id = url?.split("v=")[1]?.split("&")[0];
    if (!id) return alert("Invalid URL");
    socket.emit("set-video", { roomId, videoId: id });
  };

  return (
    <Layout>
      <button onClick={setVideo} disabled={!isHost}>Change Video</button>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 1fr", gap: 24, marginTop: 20 }}>
        <VideoPlayer videoId={videoId} roomId={roomId} isHost={isHost} />
        <Chat roomId={roomId} username={username} />
      </div>
    </Layout>
  );
}
