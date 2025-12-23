import { io } from "socket.io-client";

/**
 * 🔴 IMPORTANT
 * Replace BACKEND_URL with your actual deployed backend URL
 * Example:
 * https://yt-watchparty-backend.up.railway.app
 */
const BACKEND_URL = "https://yt-watchparty-uqxn.vercel.app/";

/**
 * Socket.IO client instance
 * - autoConnect: true → connects immediately
 * - transports: ['websocket'] → avoids polling issues on Vercel
 * - reconnection: true → handles refresh / network drops
 */
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (err) => {
  console.error("⚠️ Socket connection error:", err.message);
});

export default socket;
