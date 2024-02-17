"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
} from "@nextui-org/react";
import { UserProfile } from "@/types/profile";
import UploadModal from "../post/upload-form";
import { useSession } from "next-auth/react";

import { useDispatch, useSelector } from "react-redux";

import Follow from "../buttons/follow";
import Unfollow from "../buttons/unfollow";
import { selectCurrentUser } from "@/redux_store/slices/users/user-slice";
import { StateType } from "@/redux_store/store";

interface ProfileCardProps {
  profile: UserProfile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [status, setStatus] = useState<boolean | null>(null);
  const { data: session } = useSession();
  const dispatch = useDispatch();

  const userProfile = useSelector((state: StateType) =>
    selectCurrentUser(state, profile?.email!)
  );

  useEffect(() => {
    if (session && profile && userProfile) {
      const isFollowing = profile.followers.some(
        (follower) => follower.email === session?.user?.email
      );

      setStatus(isFollowing);
    }
  }, [profile, session, userProfile, dispatch]);

  return (
    <>
      <div className="w-full flex justify-center md:justify-center mt-2">
        <Card className="w-full m-2 items-center">
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
                targetUser={userProfile?.email!}
                initiatorUser={session?.user?.email!}
                setStatus={setStatus}
              />
            ) : (
              <Follow
                targetUser={userProfile?.email!}
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
                {userProfile?.following.length}
              </p>
              <p className=" text-default-400 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {userProfile?.followers?.length}
              </p>
              <p className="text-default-400 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
