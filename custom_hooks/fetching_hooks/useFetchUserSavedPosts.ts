import { addAllSavedPosts } from "@/redux_store/slices/saved/saved-slice";
import { Post } from "@/types/post";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface SavedPostsProps {
  email: string;
}

export default function useFetchUserSavedPosts({ email }: SavedPostsProps) {
  const [savedPostsCluster, setSavedPostsCluster] = useState<string[]>([]);
  const [relevantPosts, setRelevantPosts] = useState<Post[]>([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllSavedPosts = async () => {
      try {
        const response = await axios.get(`/api/save/?email=${email}`);
        // console.log("Custome hook for saved: ", response.data);

        setSavedPostsCluster(response.data.cluster);
        dispatch(
          addAllSavedPosts({
            email: email,
            postIds: response.data.cluster.posts,
          })
        );
        setRelevantPosts(response.data.savedPosts);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }
    };

    fetchAllSavedPosts();
  }, [email]);

  return {
    savedPostsCluster,
    relevantPosts,
    error,
  };
}
