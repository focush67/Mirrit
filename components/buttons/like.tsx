"use client";

import { Post } from "@/types/post";
import React, { memo, useCallback, useContext, useEffect } from "react";
import Hover from "../hover/hover-pop";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { likePost } from "@/redux_store/slices/posts/post-slice";
import { useSession } from "next-auth/react";
import { AuthProfile } from "@/types/profile";
import { useSocket } from "@/experiments/socket-context";
import { NotificationContext } from "@/experiments/notification-context";
import { saveNotification } from "@/server_actions/saveNotification";

interface LikeProps {
  post: Post;
  from: AuthProfile | null;
  to: AuthProfile | null;
}

export interface T_Notif {
  type: "like" | "comment";
  from: AuthProfile | null;
  to: AuthProfile | null;
  post: Post;
  content?: string;
}

let LikeButton = ({ post, from, to }: LikeProps) => {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const { socket } = useSocket();
  const { setNotifications } = useContext(NotificationContext) || {};

  useEffect(() => {
    socket?.on("post-liked", (response) => {
      setNotifications?.((prev) => {
        const newSet = new Set([...Array.from(prev), response.info]);

        return newSet;
      });
    });

    return () => {
      socket?.on("disconnect", (rsp) => {
        console.log(`Disconnected response ${rsp}`);
      });
      socket?.off("post-liked");
    };
  }, [socket]);

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
        from: from,
        to: to,
        content: null,
        post: post,
      });

      toast.success("Liked");
      const res = await saveNotification({ type: "like", from, to, post });
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  }, [post, session, dispatch]);

  return (
    <Hover text="Like">
      <Heart className="hover:cursor-pointer" onClick={handleLikeMemo} />
      <p>{post.likes}</p>
    </Hover>
  );
};

export default memo(LikeButton);
