import SearchBar from "@/components/search/search-bar";
import { getSelf } from "@/services/auth-service";
import { getProfilesFollowed } from "@/services/follow-service";

const FollowingPage = async () => {
  const profiles = await getProfilesFollowed();
  const owner = await getSelf();
  console.log("profiles at following page ", profiles?.length);
  return (
    <div className="h-[100%] shadow-2xl p-2">
      <SearchBar profiles={profiles || []} owner={owner!} isFollowed={false} />
    </div>
  );
};

export default FollowingPage;
