"use client";

import { Post } from "@/types/post";
import React, { useCallback, useContext, useEffect, useState } from "react";
import Hover from "../hover/hover-pop";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { likePost } from "@/redux_store/slices/global-slices";
import { useSession } from "next-auth/react";
import { AuthProfile } from "@/types/profile";
import { NotificationContext } from "@/experiments/notification-context";
import { useSocket } from "@/experiments/socket-context";
import { Notification } from "@/types/notification";

interface T_Notif_Req {
  type: string;
  from: string;
  to: string;
  post: string;
}

interface LikeProps {
  post: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

const LikeButton = ({ post, from, to }: LikeProps) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { setNotifications } = useContext(NotificationContext) || {};

  const setSend = async (notificationBody: T_Notif_Req) => {
    try {
      const response = await axios.post("/api/notifications", {
        notificationBody,
      });
      console.log(response.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    socket?.on("post-liked", (info) => {
      console.log("Post liked notification: ", info);
      setNotifications?.((prev) => {
        const newSet = new Set([...Array.from(prev), info]);
        // After updating the set, you can also send the notification to the server
        setSend({
          type: info.type,
          from: info.from._id,
          to: info.to._id,
          post: info.post._id,
        });
        return newSet;
      });
    });
  });

  const handleLikeMemo = useCallback(async () => {
    try {
      if (!session) {
        toast.error("Requires Login for Liking");
        return;
      }
      const response = await axios.post(`/api/posts/like/?id=${post._id}`);
      dispatch(likePost({ _id: post._id }));
      socket?.emit("send-notification", {
        type: "like",
        post: post,
        from: from,
        to: to,
      });
      toast.success("Liked");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  }, [post, session, dispatch, from, socket, to]);

  return (
    <Hover text="Like">
      <Heart className="hover:cursor-pointer" onClick={handleLikeMemo} />
      <p>{post.likes}</p>
    </Hover>
  );
};

export default LikeButton;
