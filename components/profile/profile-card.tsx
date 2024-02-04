"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import { UserProfile } from "@/types/profile";
import UploadModal from "../post/upload-form";
import { useSession } from "next-auth/react";

import { useDispatch, useSelector } from "react-redux";

import { GlobalState } from "@/types/state";

import Follow from "../buttons/follow";
import Unfollow from "../buttons/unfollow";

interface ProfileCardProps {
  profile: UserProfile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [status, setStatus] = useState<boolean | null>(null);
  const { posts } = useFetchUserPosts({ email: profile?.email! });
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const allUsers = useSelector((state: GlobalState) => state.users);

  const userProfile = allUsers.filter((user) => user.email === profile?.email);

  useEffect(() => {
    if (session && profile && allUsers?.length > 0) {
      const userWithEmail = allUsers.find(
        (user: UserProfile) => user.email === profile.email
      );

      if (userWithEmail) {
        const isFollowing = profile.followers.some(
          (follower) => follower.email === session?.user?.email
        );

        if (isFollowing) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      }
    }
  }, [profile, posts, session, allUsers, dispatch]);

  return (
    <>
      <div className="w-full flex justify-center md:w-3/4 lg:w-1/2 md:justify-center mt-2">
        <Card className="w-full md:w-4/5 lg:w-full m-2 items-center">
          <CardHeader className="flex justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={profile?.image!}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {profile?.name}
                </h4>
                <h5 className="text-small tracking-tight text-default-400 mr-3">
                  {profile?.email}
                </h5>
              </div>
            </div>
            {session?.user?.email === profile?.email ? (
              <UploadModal />
            ) : status === true ? (
              <Unfollow
                targetUser={userProfile[0]?.email!}
                initiatorUser={session?.user?.email!}
                setStatus={setStatus}
              />
            ) : (
              <Follow
                targetUser={userProfile[0]?.email!}
                initiatorUser={session?.user?.email!}
                setStatus={setStatus}
              />
            )}
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <span className="pt-2"></span>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {userProfile[0]?.following.length}
              </p>
              <p className=" text-default-400 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {userProfile[0]?.followers?.length}
              </p>
              <p className="text-default-400 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
