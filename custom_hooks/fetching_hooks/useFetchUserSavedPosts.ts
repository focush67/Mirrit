import { Post } from "@/types/post";
import axios from "axios";
import { useEffect, useState } from "react";

interface SavedPostsProps {
  email: string;
}

export default function useFetchUserSavedPosts({ email }: SavedPostsProps) {
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const fetchAllSavedPosts = async () => {
      try {
        const response = await axios.get(`/api/save/?email=${email}`);
        console.log(response.data);
        if (response.data.posts) {
          setSavedPosts(response.data.posts);
        }
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchAllSavedPosts();
  }, [email]);

  return {
    savedPosts,
    error,
  };
}
