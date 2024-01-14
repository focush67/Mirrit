"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import useFetchUserPosts from "@/custom_hooks/fetching_hooks/useFetchUserPosts";
import { Post } from "@/types/post";
import { UserProfile } from "@/types/profile";
import UploadModal from "../post/upload-form";
import { signIn, useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addRelationship,
  removeRelationship,
} from "@/redux_store/slices/global-slices";
import { GlobalState } from "@/types/state";

interface ProfileCardProps {
  profile: UserProfile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [isFollowed, setIsFollowed] = useState(false);
  const { posts } = useFetchUserPosts({ email: profile?.email! });
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const allUsers = useSelector((state: GlobalState) => state.users);
  const allPosts = useSelector((state: GlobalState) => state.posts);

  const reduxProfile = allUsers?.find(
    (user: UserProfile) => user.email === profile?.email
  );
  const isVisitor = session?.user?.email !== profile?.email;

  useEffect(() => {
    if (session && profile && allUsers?.length > 0) {
      const userWithEmail = allUsers.find(
        (user: UserProfile) => user.email === profile.email
      );

      if (userWithEmail) {
        const isFollowing = profile.followers.some(
          (follower) => follower.email === session?.user?.email
        );

        setIsFollowed(isFollowing);
      }
    }
  }, [profile, posts, session, allUsers, dispatch]);

  const handleButtonClick = async () => {
    if (!session) {
      signIn("google");
      return null;
    }

    if (isVisitor) {
      if (isFollowed) {
        console.log("Already following, hence unfollow");
        await unfollowRequest();
        return;
      } else {
        const response = await axios.post(
          `/api/follow/?initiator=${session?.user?.email}&target=${profile?.email}`
        );
        console.log(response.data);
        if (response.data.status !== 301) {
          dispatch(
            addRelationship({
              initiator: session?.user?.email!,
              target: profile?.email!,
            })
          );
        } else if (response.data.status === 201) {
          setIsFollowed(true);
        }
      }
    } else {
      return null;
    }
  };

  const unfollowRequest = async () => {
    const initiator = session?.user?.email;
    const target = profile?.email;

    const response = await axios.post(
      `/api/unfollow/?initiator=${initiator}&target=${target}`
    );
    console.log(response.data);

    if (response.data.status === 200) {
      console.log("Dispatching unfollow");
      dispatch(
        removeRelationship({
          initiator: initiator!,
          target: target!,
        })
      );
    }

    setIsFollowed(false);
  };

  return (
    <>
      <div className="w-screen flex justify-center">
        <Card className="sm:w-[70%] md:w-[100%] lg:w-[70%] items-center">
          <CardHeader className="justify-between">
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
                <h5 className="text-small tracking-tight text-default-400">
                  {profile?.email}
                </h5>
              </div>
            </div>
            <FollowButton
              isVisitor={isVisitor}
              isFollowed={isFollowed}
              handleButtonClick={handleButtonClick}
            />
          </CardHeader>
          <CardBody className="px-3 py-0 text-small text-default-400">
            <span className="pt-2">#FrontendWithZoey</span>
          </CardBody>
          <CardFooter className="gap-3">
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {profile?.following.length}
              </p>
              <p className=" text-default-400 text-small">Following</p>
            </div>
            <div className="flex gap-1">
              <p className="font-semibold text-default-400 text-small">
                {profile?.followers?.length}
              </p>
              <p className="text-default-400 text-small">Followers</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

const FollowButton = ({
  isVisitor,
  isFollowed,
  handleButtonClick,
}: {
  isVisitor: boolean;
  isFollowed: boolean;
  handleButtonClick: () => void;
}) => (
  <Button
    className={
      isVisitor
        ? isFollowed
          ? "bg-transparent text-foreground border-default-200"
          : ""
        : ""
    }
    color="primary"
    radius="full"
    size="sm"
    variant={isFollowed ? "bordered" : "solid"}
    onClick={handleButtonClick}
  >
    {!isVisitor ? <UploadModal /> : isFollowed ? "Unfollow" : "Follow"}
  </Button>
);
