import { Card, CardHeader, Avatar, CardBody } from "@nextui-org/react";
import { User } from "@prisma/client";
import RemoveFollower from "../buttons/remove-follower";

import UnfollowButton from "../buttons/unfollow-button";

export const SearchItem = ({
  profile,
  isFollowed,
  owner,
}: {
  profile: User;
  isFollowed: boolean;
  owner: User;
}) => {
  return (
    <Card className="w-3/4 md:w-[60%] lg:w[40%] h-[40%] shadow-2xl">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src={profile.imageUrl!} />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {profile.username}
            </h4>
          </div>
        </div>

        {isFollowed ? (
          <RemoveFollower profileId={profile.id} ownerId={owner.id} />
        ) : (
          <UnfollowButton profile={profile} visitor={owner} />
        )}
      </CardHeader>
      <CardBody className="px-3 py-0 text-small text-default-400">
        <span className="pt-2"></span>
      </CardBody>
    </Card>
  );
};
