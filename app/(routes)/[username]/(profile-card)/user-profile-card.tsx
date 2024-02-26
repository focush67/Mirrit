"use client";

import React, { useTransition } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import { User } from "@prisma/client";
import { useDispatch, useSelector } from "react-redux";
import {
  addRelationship,
  removeRelationship,
} from "@/redux_store/slices/users/user-slice";
import { StateType } from "@/redux_store/store";
import { onFollow, onUnfollow } from "@/server_actions/follow";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

interface UserProfileCardProps {
  profile: User;
  visitor: User;
  followStatus: boolean;
}

export default function UserProfileCard({
  profile,
  visitor,
  followStatus,
}: UserProfileCardProps) {
  const dispatch = useDispatch();
  const stateProfile = useSelector((state: StateType) =>
    state.users.users.find((user) => user.id === profile.id)
  );

  const [isPending, startTransition] = useTransition();
  const initiateFollow = () => {
    startTransition(() => {
      onFollow(profile.id)
        .then(() => {
          toast.success(`Now following ${profile.username}`);
          dispatch(
            addRelationship({
              initiator: visitor.id,
              target: profile.id,
            })
          );
        })
        .catch(() => toast.error(`Error following ${profile.username}`));
    });
  };

  const initiateUnfollow = () => {
    startTransition(() => {
      onUnfollow(profile.id)
        .then(() => {
          toast.success(`Unfollowed ${profile.username}`);
          dispatch(
            removeRelationship({
              initiator: visitor.id,
              target: profile.id,
            })
          );
        })
        .catch(() => toast.error(`Error unfollowing ${profile.username}`));
    });
  };

  const handleRelationship = (e: any) => {
    e.stopPropagation();
    if (followStatus) {
      initiateUnfollow();
    } else {
      initiateFollow();
    }
  };

  return (
    <>
      <div className="w-full flex justify-center md:justify-center mt-2">
        <Card className="w-full m-2">
          <CardHeader className="flex justify-between items-center">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={profile?.imageUrl!}
              />
              <div className="flex flex-col gap-1 items-start">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {profile?.username}
                </h4>
                <h5 className="text-small tracking-tight text-default-400 mr-3">
                  {profile?.bio || "This is the bio"}
                </h5>
              </div>
            </div>
            <div>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                <Button
                  variant={"shadow"}
                  size="sm"
                  onClick={handleRelationship}
                  className={
                    followStatus
                      ? "bg-red-600 text-white"
                      : "bg-blue-700 text-white"
                  }
                >
                  {followStatus ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <span className="pt-2"></span>
          </CardBody>
          <CardFooter className="flex justify-start gap-x-5">
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {stateProfile?.followedProfiles?.length}
              </p>
              <p className="text-default-400 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {stateProfile?.followers?.length}
              </p>
              <p className="text-default-400 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
