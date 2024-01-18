"use client";

import React from "react";
import { Card, CardBody, CardHeader, Image } from "@nextui-org/react";
import { useSelector } from "react-redux";
import {
  selectAllPosts,
  selectSavedCluster,
} from "@/redux_store/slices/global-slices";
import EditModal from "@/components/custom-modals/edit-post-modal";
import { Post } from "@/types/post";
import { useSession } from "next-auth/react";
import UserAvatar from "@/components/profile/user-avatar";

export default function Profile() {
  const allPosts = useSelector(selectAllPosts);
  const { data: session } = useSession();

  const profilePosts = allPosts.filter(
    (post: Post) => post.email === session?.user?.email
  );

  const relevantCluster = useSelector(selectSavedCluster);
  console.log(relevantCluster);

  return (
    <div className="gap-2 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 m-2">
      {profilePosts.map((post, index) => (
        <Card
          className="py-0 h-auto flex flex-col w-[300px] justify-between"
          key={index}
        >
          <div className="flex flex-row items-center h-auto ">
            <UserAvatar user={post} />

            <CardHeader className="pb-0 pt-2 px-2 flex-row items-center overflow-x-hidden gap-5">
              <div className="flex flex-col">
                <h4 className="font-bold text-[80%]">{post.title}</h4>
              </div>

              <EditModal post={post} />
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
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
