import ProfilesWrapper from "@/components/misc/home-page-profiles-wrapper";
import PostCard from "@/components/post-components/post-card";
import StorySidebar from "@/components/story-components/story-wrapper";
import { getAllPosts } from "@/server_actions/posts";

const HomePage = async () => {
  const posts = await getAllPosts();
  return (
    <div className="flex h-screen w-full">
      <div className="px-2 h-full z-10 overflow-y-auto w-1/3 py-8">
        <h1 className="text-xl font-semibold">Stories</h1>
        <StorySidebar />
      </div>
      <div className="py-8 w-2/3 mt-10">
        <div className="flex flex-col gap-3 items-center justify-center">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
      <div className="w-1/3 mt-10 py-8 px-2 h-screen">
        <h1 className="text-xl font-semibold text-center">Users</h1>
        <ProfilesWrapper />
      </div>
    </div>
  );
};

export default HomePage;
