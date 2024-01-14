import { Post } from "@/types/post";
import axios from "axios";
import { useState, useEffect } from "react";

interface useFetchAllPostsProps {
  email: string;
}

export default function useFetchUserPosts({ email }: useFetchAllPostsProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/posts/?email=${email}`);
        setPosts(response.data.posts);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  return { posts, error };
}
