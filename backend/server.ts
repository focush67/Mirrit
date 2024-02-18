import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { OnlineUser } from "./types/online-user";
import { Notification } from "./types/notification";
import { Post } from "../types/post";

dotenv.config();

const PORT = process.env.PORT || 4000;
const CLIENT = "http://localhost:3000";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

let onlineUsers: OnlineUser[] = [];
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

// Socket connections

io.on("connection", (socket: Socket) => {
  console.log(`User connected `, socket.id);

  socket.on("test", () => {
    console.log("Testing event was triggered");
    io.emit("test", "Testing event emmited");
  });

  // Adding a new connection or revising an existing connection

  socket.on("add-new-user", (newUser: OnlineUser) => {
    if (!newUser.email || !newUser.name) {
      console.log(
        `Registration information not at backend ${newUser.email} ${newUser.name}`
      );
      return;
    }
    console.log(`New User connected ${newUser.email} : ${newUser.socketId}`);
    const existingIndex = onlineUsers.findIndex(
      (user: OnlineUser) => user.email === newUser.email
    );

    if (existingIndex !== -1) {
      console.log(`User already connected. updating socket`);
      onlineUsers[existingIndex].socketId = socket.id;
    } else {
      onlineUsers.push({ ...newUser, socketId: socket.id });
    }

    io.emit("online-users", onlineUsers);
  });

  socket.on("send-notification", (info: Notification) => {
    const { type, from, to, content, post } = info;
    console.log({ type, from, to });

    if (!from) {
      console.log(`Origin of notification not found, aborting`);
      return;
    }

    switch (type) {
      case "like":
        const postOwner = getOwner(post);
        if (postOwner) {
          console.log(
            `${from.email} liked ${post.title} posted by ${to.email}`
          );
          console.log(`Target Socket ${postOwner.socketId}`);
          console.log(`Initiator Socket ${socket.id}`);

          io.to(postOwner.socketId).emit("post-liked", { info, onlineUsers });
        } else {
          console.log(
            `Receiver of notification not online, save to database instead`,
            { postOwner, onlineUsers }
          );
        }
        break;

      case "comment":
        console.log(`Commenting on post ${info}`);
        const owner = getOwner(post);
        if (owner) {
          console.log(`${from.email} commented on ${post.title}`);
          console.log(`Target Socket ${owner.socketId}`);
          console.log(`Initiator Socket ${socket.id}`);
          io.to(owner.socketId).emit("comment-added", { info, onlineUsers });
        } else {
          console.log(
            `Receiver of notification not online, save to DB instead`
          );
        }

        break;

      default:
        console.log("Invalid Notification Type");
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log(`Disconnected ${socket.id}`);
    onlineUsers = onlineUsers.filter(
      (user: OnlineUser) => user.socketId !== socket.id
    );
    io.emit("online-users", onlineUsers);
  });
});

const getOwner = (post: Post) => {
  const owner = onlineUsers.find((user) => user.email === post.email);
  if (owner) {
    return owner;
  }
  return null;
};

server.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
