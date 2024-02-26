import React from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  Button,
  Avatar,
} from "@nextui-org/react";
import { getAllPosts, getCommentsForPost } from "@/server_actions/posts";
import Like from "@/components/buttons/like";
import Comment from "@/components/buttons/comment";
import ShareButton from "@/components/buttons/save";
import { distance } from "@/utilities/date-format";

interface SinglePostProps {
  params: {
    id: string;
  };
}
export default async function SinglePostPage({ params }: SinglePostProps) {
  const posts = await getAllPosts();
  const singlePost = posts.find((post) => post.id === params.id);
  const comments = await getCommentsForPost(singlePost?.id!);
  return (
    <div className="w-[80vw] h-[50vh] mt-5 ml-5">
      <Card className="col-span-12 sm:col-span-4 ">
        <CardHeader className="absolute z-10 top-1 flex items-center gap-x-2">
          <Avatar src={singlePost?.owner.imageUrl!} size="lg" />
          <h4 className="text-white font-medium text-large">
            {singlePost?.owner?.username}
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={singlePost?.cover}
        />
        <Card className="border-white h-[8vh] mt-0 grid grid-cols-3 items-center justify-evenly ml-6">
          <div className="flex justify-center">
            <Like post={singlePost!} />
          </div>
          <div className="flex justify-center">
            <Comment post={singlePost!} existingComments={comments} />
          </div>
          <div className="flex justify-center">
            <ShareButton post={singlePost!} owner={singlePost?.owner!} />
          </div>
        </Card>
      </Card>

      <Card className="w-[80vw] h-[20vh] mt-2 flex flex-col bg-inherit">
        <div className="p-4">
          <h2 className="text-xl font-semibold">{singlePost?.title}</h2>
          <p className="mt-2 text-gray-600">{singlePost?.description}</p>
        </div>
        <div className="ml-4 italic">{distance(singlePost)}</div>
      </Card>

      <Card className="w-[80vw] h-[20vh] mt-2 flex flex-col bg-inherit items-center">
        <h1 className="text-xl">Comments</h1>
      </Card>
    </div>
  );
}
