import { SaveIcon } from "lucide-react";
import React from "react";
import Hover from "../hover/hover-pop";
import { toast } from "react-hot-toast";
import { Post } from "@/types/post";
import { useDispatch } from "react-redux";
import { addNewSavedPost } from "@/redux_store/slices/saved/saved-slice";
import axios from "axios";
import { Session } from "next-auth";

interface ShareProps {
  post: Post;
  session: Session | null;
}

const ShareButton = ({ post, session }: ShareProps) => {
  const dispatch = useDispatch();
  const handleSavingCluster = async () => {
    if (!session || !session?.user || !session?.user?.email) {
      toast.error("Login required");
      return;
    }

    try {
      const response = await axios.post(
        `/api/save/?email=${session?.user?.email}`,
        {
          _id: post._id,
        }
      );

      if (response.data.status === 200 || response.data.status === 201) {
        dispatch(
          addNewSavedPost({
            email: session?.user?.email!,
            postId: post._id,
          })
        );
        toast.success("Saved to Cluster");
      } else if (response.data.status === 303) {
        toast.error("Post already exists in cluster");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Some error occured");
    }
  };

  return (
    <Hover text="Save">
      <SaveIcon
        className="hover:cursor-pointer"
        onClick={handleSavingCluster}
      />
    </Hover>
  );
};

export default ShareButton;
