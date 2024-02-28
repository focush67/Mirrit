import ProfilesWrapper from "@/components/misc/home-page-profiles-wrapper";
import PostCard from "@/components/post-components/post-card";
import StorySidebar from "@/components/story-components/story-wrapper";
import { getAllPosts } from "@/server_actions/posts";

const HomePage = async () => {
  const posts = await getAllPosts();
  return (
    <div className="flex h-screen w-full min-h-screen">
      <div className="px-2 h-full w-fit">
        <div className="py-8">
          <h1 className="text-lg font-semibold mt-9">View</h1>
          <StorySidebar />
        </div>
      </div>
      <div className="py-8 ml-1 mt-10">
        <div className="flex flex-col flex-1 gap-3 items-center w-fit">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="py-8 w-fit mt-9 ml-2">
        <div className="h-full">
          <h1 className="text-xl font-semibold text-center">Users</h1>
          <ProfilesWrapper />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
