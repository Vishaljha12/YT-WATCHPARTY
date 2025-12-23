/**
 * YouTube Watch Party Backend
 * Tech: Node.js + Express + Socket.IO
 * Storage: In-memory (MVP)
 */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow frontend access
  },
});

app.use(cors());

const PORT = 5000;

/**
 * In-memory room store
 * Structure:
 * rooms = {
 *   roomId: {
 *     hostId,
 *     videoId,
 *     isPlaying,
 *     currentTime,
 *     users: [{ socketId, username }]
 *   }
 * }
 */
const rooms = {};

/**
 * Socket.IO Connection
 */
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /**
   * Join Room
   */
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    // Create room if not exists
    if (!rooms[roomId]) {
      rooms[roomId] = {
        hostId: socket.id,
        videoId: "",
        isPlaying: false,
        currentTime: 0,
        users: [],
      };
    }

    // Add user
    rooms[roomId].users.push({
      socketId: socket.id,
      username,
    });

    // Send current room state to the joining user
    socket.emit("room-state", {
      hostId: rooms[roomId].hostId,
      videoId: rooms[roomId].videoId,
      isPlaying: rooms[roomId].isPlaying,
      currentTime: rooms[roomId].currentTime,
      users: rooms[roomId].users,
    });

    // Notify others
    socket.to(roomId).emit("user-joined", {
      socketId: socket.id,
      username,
    });

    console.log(`${username} joined room ${roomId}`);
  });

  /**
   * Set / Change Video (Host only)
   */
  socket.on("set-video", ({ roomId, videoId }) => {
    if (!rooms[roomId]) return;
    if (rooms[roomId].hostId !== socket.id) return;

    rooms[roomId].videoId = videoId;
    rooms[roomId].currentTime = 0;
    rooms[roomId].isPlaying = false;

    io.to(roomId).emit("video-changed", videoId);
  });

  /**
   * Play Video (Host only)
   */
  socket.on("play-video", ({ roomId, currentTime }) => {
    if (!rooms[roomId]) return;
    if (rooms[roomId].hostId !== socket.id) return;

    rooms[roomId].isPlaying = true;
    rooms[roomId].currentTime = currentTime;

    socket.to(roomId).emit("play-video", currentTime);
  });

  /**
   * Pause Video (Host only)
   */
  socket.on("pause-video", ({ roomId, currentTime }) => {
    if (!rooms[roomId]) return;
    if (rooms[roomId].hostId !== socket.id) return;

    rooms[roomId].isPlaying = false;
    rooms[roomId].currentTime = currentTime;

    socket.to(roomId).emit("pause-video", currentTime);
  });

  /**
   * Seek Video (Host only)
   */
  socket.on("seek-video", ({ roomId, currentTime }) => {
    if (!rooms[roomId]) return;
    if (rooms[roomId].hostId !== socket.id) return;

    rooms[roomId].currentTime = currentTime;
    socket.to(roomId).emit("seek-video", currentTime);
  });

  /**
   * Chat Message
   */
  socket.on("chat-message", ({ roomId, username, message }) => {
    socket.to(roomId).emit("chat-message", {
      username,
      message,
      time: new Date().toLocaleTimeString(),
    });
  });

  /**
   * Handle Disconnect
   */
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const roomId in rooms) {
      const room = rooms[roomId];

      // Remove user
      room.users = room.users.filter(
        (user) => user.socketId !== socket.id
      );

      // If host leaves, assign new host
      if (room.hostId === socket.id && room.users.length > 0) {
        room.hostId = room.users[0].socketId;
        io.to(roomId).emit("new-host", room.hostId);
      }

      // If room empty, delete it
      if (room.users.length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

/**
 * Start Server
 */
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
