"use client";
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { Follow, User } from "@prisma/client";
import PostUploadModal from "../post-components/upload-modal";
import EditBioModal from "../custom-modals/edit-bio-modal";
import Link from "next/link";

interface ProfileCardProps {
  profile:
    | (User & {
        following: Follow[];
        followedBy: Follow[];
      })
    | null;
}

export default async function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <div className="w-full flex justify-center md:justify-center mt-2">
      <Card className="w-full m-2 items-center shadow-2xl">
        <CardHeader className="flex justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={profile?.imageUrl!}
            />
            <div className="flex flex-col gap-1 items-start justify-between">
              {/* Use hidden-xs to hide on extra small screens */}
              <h4 className="text-xs font-semibold leading-none text-default-600">
                {profile?.username}
              </h4>
              <span className={`text-xs tracking-tight text-default-400 mr-3`}>
                {profile?.bio || "This is the bio"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EditBioModal initialBio={profile?.bio} />
            <PostUploadModal />
          </div>
        </CardHeader>
        <CardBody className="px-3 py-0 text-small text-default-400">
          <span className="pt-2"></span>
        </CardBody>
        <CardFooter className="gap-3">
          <Link
            href={`/following`}
            className={`group flex gap-1 ${
              profile?.following.length === 0
                ? "pointer-events-none"
                : "hover:cursor-pointer hover:font-bold transition-all delay-75"
            }`}
          >
            <p className="font-semibold text-default-400 text-small">
              {profile?.following?.length}
            </p>
            <p className="text-default-400 text-small">Following</p>
          </Link>
          <Link
            href={`/followers`}
            className={`group flex gap-1 ${
              profile?.followedBy.length === 0
                ? "pointer-events-none"
                : "hover:cursor-pointer hover:font-bold transition-all delay-75"
            }`}
          >
            <p className="font-semibold text-default-400 text-small hover:cursor-pointer">
              {profile?.followedBy?.length}
            </p>
            <p className="text-default-400 text-small">Followers</p>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
