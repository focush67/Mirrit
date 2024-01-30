import axios from "axios";
import { useState, useEffect } from "react";

interface LikeProps {
  postId: string;
}

export default function useLike({ postId }: LikeProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    const postUserLike = async () => {
      try {
        const response = await axios.post(`/api/posts/like/?id=${postId}`);
        // console.log(response.data);
        setSuccess(true);
      } catch (error: any) {
        console.log(error.message);
        setError(error.message);
      }
    };

    postUserLike();
  }, []);

  return { error, success };
}
