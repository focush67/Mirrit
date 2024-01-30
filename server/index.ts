import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import dotenv from "dotenv";
import { Notification as NotificationType } from "./types/notification";
import { Notification } from "../models/notification-schema";

dotenv.config();

const app = express();

const CLIENT_URL = process.env.CLIENT_URL;

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

const httpServer = createServer(app);

type OnlineUser = {
  name: string;
  email: string;
  image: string;
  socketId: string;
};

let onlineUsers: OnlineUser[] = [];

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("test", () => {
    console.log("Testing Event triggered:");
    io.emit("test", "Testing event was returned");
  });

  socket.on("add-new-user", (newUser: OnlineUser) => {
    if (!newUser.email || !newUser.name) {
      console.log("Registration info not at socket backend");
      return;
    }
    console.log(`New User Connected  ${newUser.email} ,${newUser.socketId}`);
    const existingIndex = onlineUsers.findIndex(
      (user: OnlineUser) => user.email === newUser.email
    );

    if (existingIndex !== -1) {
      console.log("User already connected, updating socket");
      onlineUsers[existingIndex].socketId = socket.id;
    } else {
      onlineUsers.push({ ...newUser, socketId: socket.id });
    }

    console.log("Total Online Users: ", onlineUsers.length);
    io.emit("online-users", onlineUsers);
  });

  socket.on("send-notification", (info: NotificationType) => {
    const { type, post, from, to } = info;
    console.log(info);
    if (!from) {
      console.log("Origin of notification not found, returning");
      return;
    }

    if (type === "like") {
      const postOwner = getOwner(post);
      if (postOwner) {
        console.log(
          `${from.email} liked ${post.title} posted by ${post.email}`
        );
        console.log("Target Socket : ", postOwner.socketId);
        console.log("Initiator Socket : ", socket.id);
        io.to(postOwner.socketId).emit("post-liked", info);
      } else {
        console.log("Receiver of notification not found online, save to DB:", {
          postOwner,
        });
      }
    } else if (type === "comment") {
      console.log("Commenting on post: ", info);
      const postOwner = getOwner(post);
      if (postOwner) {
        console.log(`${from.email} commented on ${post.title}`);
        console.log("Target Socket : ", postOwner.socketId);
        console.log("Initiator Socket : ", socket.id);
        io.to(postOwner.socketId).emit("comment-added", info);
      } else {
        console.log("Receiver of notification not online, save to DB");
      }
    } else {
      console.log("Invalid Notification Type");
      return;
    }
  });
});

const getOwner = (post: any): OnlineUser | null => {
  const postOwner = onlineUsers.find((user) => user.email === post.email);
  if (postOwner) {
    return postOwner;
  }
  return null;
};

const HTTP_PORT = process.env.HTTP_PORT!;

httpServer.listen(HTTP_PORT, () => {
  console.log(`Server running at port ${HTTP_PORT}`);
});
