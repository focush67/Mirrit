import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import Link from "next/link";
export const Profile = ({ profile }: { profile: any }) => {
  return (
    <Card className="mt-2 w-auto">
      <CardHeader className="gap-x-20">
        <div className="flex gap-3 items-center">
          <Link href={`/${profile.username}`}>
            <Avatar
              isBordered
              radius="full"
              size="md"
              src={profile?.imageUrl!}
            />
          </Link>
          <CardBody className="hidden md:block px-3 py-0 text-small text-default-400">
            <p className="md:text-xs md:text-md hidden sm:block">
              {profile?.bio}
            </p>
          </CardBody>
        </div>
      </CardHeader>

      <CardFooter className="hidden md:flex lg:flex gap-3 ">
        <div className="flex gap-1 ">
          <p className="font-semibold text-default-400 text-small">
            {profile?.following?.length}
          </p>
          <p className=" text-default-400 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-400 text-small">
            {profile?.followedBy?.length}
          </p>
          <p className="text-default-400 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};
