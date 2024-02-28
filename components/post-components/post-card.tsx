import React, { memo } from "react";
import { Card, CardHeader, CardBody, Image } from "@nextui-org/react";
import Link from "next/link";
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
import Description from "./description";
import { distance } from "@/utilities/date-format";

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
  const comments = await getCommentsForPost(post.id);
  const self = await getSelf();
  const owner = self as User;
  const dis = distance(post);
  return (
    <Card
      className={`py-2 flex flex-col ${size === "small" && "h-auto"} ${
        size === "small" ? "w-[250px]" : "w-[260px]"
      } relative shadow-2xl md:w-[400px]`}
    >
      <div className="flex flex-row items-center h-auto ">
        <UserAvatar user={post.owner} postOwner={self?.id} isDashboard={true} />

        <CardHeader className="relative pb-0 pt-2 px-1 flex-row items-center overflow-x-hidden sm:gap-2">
          <div className="flex flex-col">
            <h4
              className={`${
                size === "small" ? "text-xs" : "text-sm"
              }  font-semibold`}
            >
              {post.title}
            </h4>
            <div className="text-xs mt-2 text-gray-600">{dis}</div>
          </div>
          {removeSaved === true ? (
            <div className="mx-2 mr-3">
              <RemoveSaved postId={post.id} />
            </div>
          ) : (
            post.owner_Id === self?.id && (
              <span
                className={`${
                  size === "large"
                    ? "hidden"
                    : "flex gap-x-5 bg-inherit w-auto rounded-full"
                }`}
              >
                <DeleteModal post={post} />
                <EditModal post={post} />
              </span>
            )
          )}
        </CardHeader>
      </div>
      <CardBody className="overflow-visible py-2 text-center flex items-center relative justify-between">
        <Link href={`/posts/${post.id}`}>
          <Image
            alt="Card background"
            className="object-cover rounded-xl"
            src={post.cover}
            width={size === "small" ? (removeSaved ? "auto" : "180") : "270"}
            isZoomed
          />
        </Link>

        <Description text={post.description!} size={size} />
        {removeSaved === false && (
          <div
            className={`flex  ${
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
