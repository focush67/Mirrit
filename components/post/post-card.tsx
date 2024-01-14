"use client";

import React from "react";
import { Heart, SaveIcon } from "lucide-react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Hover from "../hover/hover-pop";
import { Post } from "@/types/post";
import UserAvatar from "../profile/user-avatar";
import CommentSection from "../comments/coment-section";
import { useDispatch } from "react-redux";
import { likePost } from "@/redux_store/slices/posts-slice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const handleLike = async () => {
    try {
      const response = await axios.post(`/api/posts/like/?id=${post._id}`);
      console.log(response.data);
      dispatch(likePost({ _id: post._id }));
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const handleRouting = (email: string) => {
    if (session?.user?.email === email) {
      router.push(`/dashboard`);
    } else {
      router.push(`/${email}`);
    }
  };

  return (
    <Card className="py-1">
      <div
        className="flex flex-row items-center"
        onClick={() => handleRouting(post.email!)}
      >
        <UserAvatar user={post} />

        <CardHeader className="pb-0 pt-2 px-2 flex-col items-start">
          <p className="text-tiny uppercase font-bold">{post.userName}</p>
          <h4 className="font-bold text-large">{post.title}</h4>
        </CardHeader>
      </div>
      <CardBody className="overflow-visible py-2 text-center">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={post.cover}
          width={270}
          isZoomed
        />
        <div className="mt-2 max-h-24 overflow-hidden">
          <p className="whitespace-pre-line">{post.description}</p>
        </div>
        <div className="my-4 mx-2 flex justify-evenly">
          <Hover text="like">
            <Heart className="hover:cursor-pointer" onClick={handleLike} />
            <p>{post.likes}</p>
          </Hover>
          <Hover text="comment">
            <CommentSection currentPost={post} />
          </Hover>
          <Hover text="save">
            <SaveIcon className="hover:cursor-pointer" />
          </Hover>
        </div>
      </CardBody>
    </Card>
  );
}
