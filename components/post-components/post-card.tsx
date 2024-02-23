import React, { memo } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";

import LikeButton from "@/components/buttons/like";
import { Post, User } from "@prisma/client";
import UserAvatar from "../profile/user-avatar";
import CommentButton from "../buttons/comment";
import ShareButton from "../buttons/save";
import { getCommentsForPost } from "@/server_actions/posts";
import { getSelf } from "@/services/auth-service";
import DeleteModal from "../custom-modals/delete-post-modal";
import EditModal from "../custom-modals/edit-post-modal";
import RemoveSaved from "../buttons/remove-saved-button";

interface PostCardProps {
  post: Post & { owner: User };
  size?: "small" | "large";
  removeSaved?: boolean;
}

let PostCard = async ({
  post,
  size = "large",
  removeSaved = false,
}: PostCardProps) => {
  console.log(`${post.title} rendered`);
  const comments = await getCommentsForPost(post.id);
  const self = await getSelf();
  const owner = self as User;
  return (
    <Card
      className={`py-2 flex flex-col ${size === "small" && "h-[420px]"} ${
        size === "small" ? "w-[250px]" : "w-[300px]"
      } relative shadow-2xl`}
    >
      <div className="flex flex-row items-center h-auto ">
        <UserAvatar user={post.owner} postOwner={self?.id} isDashboard={true} />

        <CardHeader className="relative pb-0 pt-2 px-1 flex-row items-center overflow-x-hidden sm:gap-2">
          <div className="flex flex-col">
            <p
              className={`${
                size === "small" ? "hidden" : "text-sm"
              } uppercase font-bold`}
            >
              {post.owner.username}
            </p>
            <h4
              className={`${
                size === "small" ? "text-xs" : "text-sm"
              } uppercase font-bold`}
            >
              {post.title}
            </h4>
          </div>

          {removeSaved === true ? (
            <RemoveSaved postId={post.id} />
          ) : (
            post.owner_Id === self?.id && (
              <div
                className={`${
                  size === "large" ? "hidden" : "flex ml-0 gap-x-6"
                } `}
              >
                <DeleteModal post={post} />
                <EditModal post={post} />
              </div>
            )
          )}
        </CardHeader>
      </div>
      <CardBody className="overflow-visible py-2 text-center items-center ">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={post.cover}
          width={size === "small" ? (removeSaved ? "auto" : "180") : "270"}
          height={size === "small" ? "180" : "270"}
          isZoomed
        />
        {removeSaved === false && (
          <div className="mt-2 max-h-24 overflow-hidden">
            <p
              className={`${
                size === "small" ? "text-xs" : "text-sm"
              } whitespace-pre-line`}
            >
              {post.description}
            </p>
          </div>
        )}
        {removeSaved === false && (
          <div
            className={`flex ${
              size === "small" ? "justify-center" : "justify-between"
            } items-center  mt-3 ${
              size === "small" ? "w-[100px]" : "w-[200px]"
            } gap-2`}
          >
            <LikeButton post={post} />

            <CommentButton post={post} existingComments={comments} />

            <ShareButton post={post} owner={owner} />
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default memo(PostCard);
