import { Profile } from "./profile-home-card";
import { db } from "@/utilities/database";
import { getSelf } from "@/services/auth-service";

const ProfilesWrapper = async () => {
  const self = await getSelf();
  const profiles = await db.user.findMany({
    where: {
      NOT: {
        id: self?.id,
      },
    },
    include: {
      following: true,
      followedBy: true,
    },
  });
  return (
    <div className="w-auto">
      {profiles.map((profile, index) => (
        <Profile profile={profile} key={index} />
      ))}
    </div>
  );
};

export default ProfilesWrapper;
