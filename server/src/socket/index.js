import { Server } from "socket.io";
import http from "http";
import express from "express";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS options
const io = new Server(server, {
  cors: {
    origin: [process.env.CREATOR_HOST, process.env.CLIENT_HOST],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory store for connected users
const users = {};

// Helper function to get receiver's socket ID
export const getReceiverSocketId = (receiverId) => users[receiverId];

// Handle socket connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    users[userId] = socket.id; // Store user ID with its socket ID
    // console.log(`User connected: ${userId} with socket ID: ${socket.id}`);

    // Emit updated online users to all clients
    io.emit("onlineUsers", Object.keys(users));
  }

  // Handle user disconnect
  socket.on("disconnect", () => {
    // console.log(`User disconnected: ${socket.id}`);

    if (userId) {
      delete users[userId]; // Remove user from the store
      io.emit("onlineUsers", Object.keys(users)); // Notify all users
    }
  });
});

// Export modules
export { app, server, io };
