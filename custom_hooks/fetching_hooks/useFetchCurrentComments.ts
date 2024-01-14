import { Comment } from "@/types/comment";
import { Post } from "@/types/post";
import axios from "axios";
import { useState, useEffect } from "react";

interface CurrentCommentsProps {
  post: Post;
}

export default function useFetchCurrentComments({
  post,
}: CurrentCommentsProps) {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentComments = async () => {
      try {
        const response = await axios.get(`/api/posts/comment/?id=${post._id}`);
        setAllComments(response.data.comments);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentComments();
  }, [post]);

  return {
    allComments,
    error,
    loading,
  };
}
