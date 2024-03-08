import React from "react";
import { Card, CardHeader, Image, Avatar } from "@nextui-org/react";
import { getAllPosts } from "@/server_actions/posts";
import { distance } from "@/utilities/date-format";
import { db } from "@/utilities/database";
import { Comment as CommentType, User } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { CommentCard } from "@/components/comments/comment-card";

interface SinglePostProps {
  params: {
    id: string;
  };
}

export default async function SinglePostPage({ params }: SinglePostProps) {
  const posts = await getAllPosts();
  const singlePost = posts.find((post) => post.id === params.id);
  const comments = await db.comment.findMany({
    where: {
      post_Id: singlePost?.id,
    },
    include: {
      commentor: true,
    },
  });

  return (
    <div className="mt-2 ml-1 mr-1 py-2 flex flex-col items-center justify-center">
      <Card className="w-fit col-span-12 sm:col-span-4 flex items-center">
        <CardHeader className="absolute z-10 top-1 flex items-center gap-x-2">
          <Avatar src={singlePost?.owner.imageUrl!} size="lg" />
          <h4 className="text-white font-medium text-large">
            {singlePost?.owner?.username}
          </h4>
          <div></div>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-fit h-fit object-cover"
          src={singlePost?.cover}
        />
      </Card>

      <Card className="w-[80vw] mt-2 flex flex-col bg-inherit">
        <div className="p-4">
          <h2 className="text-xl font-semibold">{singlePost?.title}</h2>
          <p className="mt-2 text-gray-600">{singlePost?.description}</p>
        </div>
        <div className="ml-4 italic p-2">{distance(singlePost)}</div>
      </Card>

      <Card className="w-[80vw] oveflow-y-auto mt-2 flex flex-col bg-inherit">
        <div className="p-4">
          <h1 className="text-xl font-semibold">Comments</h1>
          <div className="overflow-auto flex flex-col gap-y-2 p-2">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
