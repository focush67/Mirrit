"use client";

import React, { useEffect } from "react";
import { Heart, SaveIcon } from "lucide-react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Hover from "../hover/hover-pop";
import { Post } from "@/types/post";
import UserAvatar from "../profile/user-avatar";
import CommentSection from "../comments/coment-section";
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "@/redux_store/slices/global-slices";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addNewSavedPost } from "@/redux_store/slices/global-slices";
import toast from "react-hot-toast";
import DeleteModal from "../custom-modals/delete-post-modal";

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
      // console.log(response.data);
      dispatch(likePost({ _id: post._id }));
      toast.success("Liked");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Some error occured");
    }
  };

  const handleRouting = (email: string) => {
    if (session?.user?.email === email) {
      router.push(`/dashboard`);
    } else {
      router.push(`/${email}`);
    }
  };

  const handleSavingCluster = async () => {
    if (!session || !session?.user || !session?.user?.email) {
      toast.loading("Missing Email");
    }

    try {
      const response = await axios.post(
        `/api/save/?email=${session?.user?.email}`,
        {
          _id: post._id,
        }
      );

      console.log(response.data);
      if (response.data.status === 200 || response.data.status === 201) {
        // console.log("Dispatching post save");
        // console.log(session?.user?.email + " " + post._id);
        dispatch(
          addNewSavedPost({
            email: session?.user?.email!,
            postId: post._id,
          })
        );
        toast.success("Saved to Cluster");
      } else if (response.data.status === 303) {
        toast.error("Post already exists in cluster");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Some error occured");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/posts/?_id=${post._id}`);
      console.log(response.data);
      if (response.data.status === 200 || response.data.status === 201) {
        dispatch(deletePost({ _id: post._id }));
        toast.success("Deleted");
      }
    } catch (error: any) {
      console.log(error.message);
      toast.error("Couldn't delete post");
    }
  };

  return (
    <Card className="py-2 h-auto flex flex-col w-[300px]">
      <div
        className="flex flex-row items-center h-auto"
        onClick={() => handleRouting(post.email!)}
      >
        <UserAvatar user={post} />

        <CardHeader className="pb-0 pt-2 px-2 flex-row items-center overflow-x-hidden gap-5">
          <div className="flex flex-col">
            <p className="text-tiny uppercase font-bold">{post.userName}</p>
            <h4 className="font-bold text-large">{post.title}</h4>
          </div>

          {post.email === session?.user?.email && (
            <DeleteModal post={post} handleDelete={handleDelete} />
          )}
        </CardHeader>
      </div>
      <CardBody className="overflow-visible py-2 text-center items-center">
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
        <div className="flex flex-row items-center justify-center mt-3 w-[100%]">
          <Hover text="Like">
            <Heart className="hover:cursor-pointer" onClick={handleLike} />
            <p>{post.likes}</p>
          </Hover>
          <Hover text="Comment">
            <CommentSection currentPost={post} />
          </Hover>
          <Hover text="Save">
            <SaveIcon
              className="hover:cursor-pointer"
              onClick={handleSavingCluster}
            />
          </Hover>
        </div>
      </CardBody>
    </Card>
  );
}
