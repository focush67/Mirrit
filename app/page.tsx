import PostCard from "@/components/post-components/post-card";
import { getAllPosts } from "@/server_actions/posts";
interface fileNameProps {}

const HomePageError = async ({}: fileNameProps) => {
  const posts = await getAllPosts();
  posts.map((p) => console.log(p.title));
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2">
      {posts.map((post, index) => (
        <div className="m-2 lg:flex-row md:flex-row sm:flex-col " key={index}>
          <PostCard post={post} />
        </div>
      ))}
    </main>
  );
};

export default HomePageError;
