"use client";

import React, { memo, useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Image, Button } from "@nextui-org/react";
import { Post } from "@/types/post";
import UserAvatar from "../profile/user-avatar";
import { useDispatch } from "react-redux";
import { deletePost } from "@/redux_store/slices/posts/post-slice";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import DeleteModal from "../custom-modals/delete-post-modal";
import EditModal from "../custom-modals/edit-post-modal";
import LikeButton from "../buttons/like";
import CommentButton from "../buttons/comment";
import ShareButton from "../buttons/save";
import { AuthProfile } from "@/types/profile";
import { Trash } from "lucide-react";

interface PostCardProps {
  post: Post;
  remove?: (post: Post) => void;
}

let PostCard = ({ post, remove }: PostCardProps) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [targetUser, setTargetUser] = useState<AuthProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<AuthProfile | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const response = await axios.get(
        `/api/user/?email=${session?.user?.email}`
      );
      setCurrentUser(response.data.user);
    };

    const fetchTargetProfile = async () => {
      const response = await axios.get(`/api/user/?email=${post.email}`);
      setTargetUser(response.data.user);
    };

    Promise.all([fetchCurrentUser(), fetchTargetProfile()]);
  }, [post.email, session?.user?.email]);

  const handleRouting = (email: string) => {
    if (session?.user?.email === email) {
      router.push(`/dashboard`);
    } else {
      router.push(`/${email}`);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`/api/posts/?_id=${post._id}`);
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
    <Card className="py-2 h-auto max-h-auto flex flex-col w-[300px]">
      <div
        className="flex flex-row items-center h-auto"
        onClick={() => handleRouting(post.email!)}
      >
        <UserAvatar user={post} />

        <CardHeader className="pb-0 pt-2 px-1 flex-row items-center overflow-x-hidden sm:gap-2">
          <div className="flex flex-col">
            <p className="text-sm uppercase font-bold">{post.userName}</p>
            <h4 className="font-bold text-sm">{post.title}</h4>
          </div>

          <div>
            {remove ? (
              <Button onClick={() => remove(post)} className="text-sm">
                <Trash />
              </Button>
            ) : (
              post.email === session?.user?.email && (
                <div className="inline-flex">
                  <DeleteModal post={post} handleDelete={handleDelete} />
                  <EditModal post={post} />
                </div>
              )
            )}
          </div>
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
          {pathname !== "/dashboard" && (
            <p className="whitespace-pre-line">{post.description}</p>
          )}
        </div>
        <div className="flex flex-row items-center justify-center mt-3 w-[100%] gap-2">
          <LikeButton post={post} from={currentUser} to={targetUser} />

          <CommentButton post={post} from={currentUser} to={targetUser} />
          <ShareButton post={post} session={session} />
        </div>
      </CardBody>
    </Card>
  );
};

export default memo(PostCard);
