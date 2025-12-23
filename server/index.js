const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    if (!rooms[roomId]) {
      rooms[roomId] = {
        hostId: socket.id,
        users: {}
      };
    }

    rooms[roomId].users[socket.id] = username;
    socket.join(roomId);

    socket.emit("room-state", {
      hostId: rooms[roomId].hostId
    });

    console.log(username, "joined room", roomId);
  });

  socket.on("set-video", ({ roomId, videoId }) => {
    if (rooms[roomId]?.hostId !== socket.id) return;
    io.to(roomId).emit("video-changed", videoId);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
