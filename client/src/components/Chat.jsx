import { useEffect, useState } from "react";
import socket from "../socket";

export default function Chat({ roomId, username }) {
  const [msg, setMsg] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    socket.on("chat-message", m => setList(p => [...p, m]));
    return () => socket.off("chat-message");
  }, []);

  const send = () => {
    if (!msg) return;
    socket.emit("chat-message", { roomId, username, message: msg });
    setList(p => [...p, { username, message: msg }]);
    setMsg("");
  };

  return (
    <div style={styles.box}>
      <div style={styles.messages}>
        {list.map((m, i) => (
          <div key={i} style={{ ...styles.msg, alignSelf: m.username === username ? "flex-end" : "flex-start" }}>
            <small>{m.username}</small>
            <div>{m.message}</div>
          </div>
        ))}
      </div>

      <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message" />
      <button onClick={send}>Send</button>
    </div>
  );
}

const styles = {
  box: { background: "#343435ff", padding: 12, borderRadius: 12 },
  messages: { display: "flex", flexDirection: "column", height: 260, overflowY: "auto" },
  msg: { background: "#2a2d3a", padding: 8, borderRadius: 8, marginBottom: 8, maxWidth: "80%" },
};
