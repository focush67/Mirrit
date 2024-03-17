import React from "react";
import { Card, CardHeader, Image, Avatar, Divider } from "@nextui-org/react";
import { getAllPosts } from "@/server_actions/posts";
import { distance } from "@/utilities/date-format";
import { db } from "@/utilities/database";
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
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-[800px] mx-auto mb-8 p-2">
        <CardHeader className="flex items-center gap-4">
          <Avatar src={singlePost?.owner.imageUrl!} size="lg" />
          <div>
            <h4 className="text-lg font-semibold">
              {singlePost?.owner?.username}
            </h4>
            <p className="text-sm text-gray-600">
              Posted {distance(singlePost)}
            </p>
          </div>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="w-full h-fit object-cover"
          src={singlePost?.cover}
        />
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{singlePost?.title}</h2>
          <p className="text-lg text-gray-700">{singlePost?.description}</p>
        </div>
      </Card>

      <Card className="w-full max-w-[800px] h-screen mx-auto">
        <div className="p-4">
          <h1 className="text-xl font-semibold mb-4">Comments</h1>
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
