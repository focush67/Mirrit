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
import { UserProfile } from "@/types/profile";
import UploadModal from "../post/upload-form";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  addRelationship,
  removeRelationship,
} from "@/redux_store/slices/global-slices";
import { GlobalState } from "@/types/state";
import toast from "react-hot-toast";

interface ProfileCardProps {
  profile: UserProfile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const [status, setStatus] = useState(false);
  const { posts } = useFetchUserPosts({ email: profile?.email! });
  const { data: session } = useSession();
  const dispatch = useDispatch();
  const allUsers = useSelector((state: GlobalState) => state.users);

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

        if (isFollowing) {
          setStatus(true);
        } else {
          setStatus(false);
        }
      }
    }
  }, [profile, posts, session, allUsers, dispatch]);

  const handleToggleRelationship = async () => {
    if (status === true) {
      /* dispatch unfollow request and set status to false */
      const initiator = session?.user?.email;
      const target = profile?.email;
      try {
        const response = await axios.post(
          `/api/unfollow/?initiator=${initiator}&target=${target}`
        );

        if (response.data.status === 200) {
          console.log("Dispatching unfollow");
          dispatch(
            removeRelationship({
              initiator: initiator!,
              target: target!,
            })
          );
          toast.success("Unfollowed");
        }
      } catch (error: any) {
        console.log(error.message);
        toast.error("Some error occured in unfollowing");
      } finally {
        setStatus(false);
      }
    } else if (status === false) {
      /* dispatch follow request and set isFollowed to Unfollow*/
      try {
        const response = await axios.post(
          `/api/follow/?initiator=${session?.user?.email}&target=${profile?.email}`
        );
        if (response.data.status !== 301) {
          dispatch(
            addRelationship({
              initiator: session?.user?.email!,
              target: profile?.email!,
            })
          );
        }
      } catch (error: any) {
        console.log(error.message);
        toast.error("Some error occured while following");
      } finally {
        setStatus(true);
      }
    } else {
      return null;
    }
  };

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
            ) : (
              <ToggleRelationshipButton
                status={status}
                handleClick={handleToggleRelationship}
              />
            )}
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

interface ToggleProps {
  status: boolean;
  handleClick: () => void;
}

const ToggleRelationshipButton = ({ status, handleClick }: ToggleProps) => {
  return (
    <Button
      color={status ? "secondary" : "primary"}
      size="sm"
      variant={status ? `bordered` : `flat`}
      onClick={handleClick}
    >
      {status === true ? "Unfollow" : "Follow"}
    </Button>
  );
};
