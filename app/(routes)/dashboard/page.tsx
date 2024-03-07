import ProfileCard from "@/components/profile/profile-card";
import PostCard from "@/components/post-components/post-card";
import { getSelf } from "@/services/auth-service";
import { getCurrentUserPosts } from "@/services/posts-service";

const Dashboard = async () => {
  const self = await getSelf();
  const posts = await getCurrentUserPosts();
  return (
    <div className="mt-3">
      <div className="flex justify-center items-center w-full">
        <ProfileCard profile={self} />
      </div>
      <div className="flex justify-center items-center overflow-hidden mt-2">
        <div className="grid sm:grid-cols-2 gap-3 lg:gap-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {posts?.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              size="small"
              option={true}
              interactions={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
