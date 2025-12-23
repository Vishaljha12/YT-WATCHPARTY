import { useEffect, useState } from "react";
import socket from "../socket";

export default function Chat({ roomId, username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("chat-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("chat-message");
  }, []);

  const send = () => {
    if (!message) return;
    socket.emit("chat-message", { roomId, username, message });
    setMessages((prev) => [...prev, { username, message }]);
    setMessage("");
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>Chat</h3>

      <div
        style={{
          height: 200,
          border: "1px solid #444",
          padding: 10,
          overflowY: "auto",
          marginBottom: 10
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.username}:</b> {m.message}
          </div>
        ))}
      </div>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message"
      />
      <button onClick={send}>Send</button>
    </div>
  );
}
