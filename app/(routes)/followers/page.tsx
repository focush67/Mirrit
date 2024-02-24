import SearchBar from "@/components/search/search-bar";
import { getSelf } from "@/services/auth-service";
import { getYourFollowers } from "@/services/follow-service";

const FollowersPage = async () => {
  const profiles = await getYourFollowers();
  console.log("profiles at followers page ", profiles?.length);
  const owner = await getSelf();
  return (
    <div className="h-[100%] shadow-2xl p-2">
      <SearchBar profiles={profiles || []} owner={owner!} isFollowed={true} />
    </div>
  );
};

export default FollowersPage;
